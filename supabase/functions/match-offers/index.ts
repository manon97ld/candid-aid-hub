import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  console.log(`[MATCH-OFFERS] ${step}`, details ? JSON.stringify(details) : '');
};

// Fonction utilitaire pour calculer la similarité entre deux chaînes
function similarity(s1: string, s2: string): number {
  if (!s1 || !s2) return 0;
  const str1 = s1.toLowerCase().trim();
  const str2 = s2.toLowerCase().trim();
  if (str1 === str2) return 1;
  
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  const commonWords = words1.filter(w => words2.some(w2 => w2.includes(w) || w.includes(w2)));
  return commonWords.length / Math.max(words1.length, words2.length);
}

// Fonction pour calculer le score de matching
function calculateMatchScore(
  candidat: Record<string, unknown>,
  offre: Record<string, unknown>
): { score: number; raisons: string[] } {
  let score = 0;
  const raisons: string[] = [];

  // 1. Compétences (40%)
  const candidatCompetences = [
    ...(candidat.competences_techniques as string || '').split(',').map(s => s.trim().toLowerCase()),
    ...(candidat.competences_autres as string || '').split(',').map(s => s.trim().toLowerCase())
  ].filter(Boolean);
  
  const offreCompetences = ((offre.competences_requises as string[]) || []).map(s => s.toLowerCase());
  
  if (candidatCompetences.length > 0 && offreCompetences.length > 0) {
    const matches = candidatCompetences.filter(c => 
      offreCompetences.some(o => o.includes(c) || c.includes(o))
    );
    const compScore = Math.min((matches.length / offreCompetences.length) * 40, 40);
    score += compScore;
    if (matches.length > 0) {
      raisons.push(`${matches.length} compétence(s) correspondante(s)`);
    }
  }

  // 2. Métier recherché vs titre offre (20%)
  const metiersRecherches = (candidat.metiers_recherches as string[]) || [];
  const titreOffre = (offre.titre as string) || '';
  
  let bestMetierMatch = 0;
  for (const metier of metiersRecherches) {
    const sim = similarity(metier, titreOffre);
    bestMetierMatch = Math.max(bestMetierMatch, sim);
  }
  const metierScore = bestMetierMatch * 20;
  score += metierScore;
  if (metierScore > 10) {
    raisons.push("Poste similaire recherché");
  }

  // 3. Localisation (15%)
  const communesRecherchees = (candidat.communes_recherchees as string[]) || [];
  const lieuOffre = (offre.lieu as string || offre.ville as string || '').toLowerCase();
  
  if (communesRecherchees.some(c => lieuOffre.includes(c.toLowerCase()))) {
    score += 15;
    raisons.push(`Localisation correspondante: ${lieuOffre}`);
  } else if (communesRecherchees.length === 0) {
    score += 10; // Pas de préférence = bonus partiel
    raisons.push("Localisation flexible");
  }

  // 4. Type de contrat (15%)
  const typesContratAcceptes = (candidat.types_contrat as string[]) || [];
  const typeContratOffre = (offre.type_contrat as string || '').toLowerCase();
  
  if (typesContratAcceptes.length === 0 || 
      typesContratAcceptes.some(t => typeContratOffre.includes(t.toLowerCase()))) {
    score += 15;
    if (typeContratOffre) {
      raisons.push(`${typeContratOffre.toUpperCase()} accepté`);
    }
  }

  // 5. Secteur (10%)
  const secteursRecherches = (candidat.secteurs_recherches as string[]) || [];
  const domaineOffre = (offre.domaine as string || '').toLowerCase();
  
  if (secteursRecherches.length === 0 || 
      secteursRecherches.some(s => domaineOffre.includes(s.toLowerCase()) || s.toLowerCase().includes(domaineOffre))) {
    score += 10;
    if (domaineOffre) {
      raisons.push(`Secteur: ${domaineOffre}`);
    }
  }

  return {
    score: Math.round(Math.min(score, 100)),
    raisons
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authentification requise");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) throw new Error("Utilisateur non authentifié");

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const minScore = parseInt(url.searchParams.get("min_score") || "50");

    logStep("Params", { userId: user.id, limit, minScore });

    // Get candidat profile
    const { data: candidat, error: candidatError } = await supabaseClient
      .from('candidats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (candidatError || !candidat) {
      throw new Error("Profil candidat non trouvé");
    }

    logStep("Candidat found", { candidatId: candidat.id });

    // Get active offers
    const { data: offres, error: offresError } = await supabaseClient
      .from('offres')
      .select('*')
      .eq('statut', 'active')
      .order('date_publication', { ascending: false })
      .limit(100);

    if (offresError) {
      throw new Error(`Erreur récupération offres: ${offresError.message}`);
    }

    logStep("Offres fetched", { count: offres?.length });

    // Calculate matching scores
    const matchedOffers = (offres || [])
      .map(offre => {
        const { score, raisons } = calculateMatchScore(candidat, offre);
        return {
          ...offre,
          score_matching: score,
          raisons_matching: raisons
        };
      })
      .filter(offre => offre.score_matching >= minScore)
      .sort((a, b) => b.score_matching - a.score_matching)
      .slice(0, limit);

    logStep("Matching complete", { 
      totalOffres: offres?.length,
      matchedCount: matchedOffers.length,
      topScore: matchedOffers[0]?.score_matching || 0
    });

    // Log activity
    await supabaseClient.rpc('log_activity', {
      _user_id: user.id,
      _type_action: 'OFFER_SUGGESTED',
      _details: { 
        offers_matched: matchedOffers.length,
        top_score: matchedOffers[0]?.score_matching || 0
      },
      _visible_candidat: true
    });

    return new Response(JSON.stringify({
      success: true,
      candidat_id: candidat.id,
      total_offres: offres?.length || 0,
      matched_count: matchedOffers.length,
      offers: matchedOffers
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
