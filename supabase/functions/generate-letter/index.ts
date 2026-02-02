import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const logStep = (step: string, details?: unknown) => {
  console.log(`[GENERATE-LETTER] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY non configuré");

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

    const { offreId, candidatureId } = await req.json();
    logStep("Request received", { offreId, candidatureId });

    if (!offreId) {
      throw new Error("ID de l'offre requis");
    }

    // Get candidat profile
    const { data: candidat, error: candidatError } = await supabaseClient
      .from('candidats')
      .select('*, profiles!inner(*)')
      .eq('user_id', user.id)
      .single();

    if (candidatError || !candidat) {
      throw new Error("Profil candidat non trouvé");
    }

    // Get offer details
    const { data: offre, error: offreError } = await supabaseClient
      .from('offres')
      .select('*')
      .eq('id', offreId)
      .single();

    if (offreError || !offre) {
      throw new Error("Offre non trouvée");
    }

    logStep("Data fetched", { 
      candidatId: candidat.id, 
      offreTitre: offre.titre 
    });

    // Build context for AI
    const candidatInfo = {
      prenom: candidat.profiles?.prenom || 'Candidat',
      nom: candidat.profiles?.nom || '',
      email: candidat.profiles?.email || '',
      telephone: candidat.profiles?.telephone || '',
      competences: candidat.competences_techniques || '',
      experiences: JSON.stringify(candidat.experiences || []),
      formations: JSON.stringify(candidat.formations || []),
      ville: candidat.profiles?.ville || ''
    };

    const offreInfo = {
      titre: offre.titre,
      entreprise: offre.entreprise || 'l\'entreprise',
      description: offre.description || '',
      competences_requises: (offre.competences_requises || []).join(', '),
      lieu: offre.lieu || offre.ville || '',
      type_contrat: offre.type_contrat || ''
    };

    const systemPrompt = `Tu es un expert en rédaction de lettres de motivation professionnelles.
Rédige une lettre de motivation personnalisée, engageante et professionnelle.

Règles:
- Maximum 300 mots
- Ton professionnel mais chaleureux
- Mets en avant les compétences du candidat qui correspondent à l'offre
- Montre l'enthousiasme et la motivation
- Structure: Introduction accrocheur → Compétences pertinentes → Motivation → Conclusion avec appel à l'action
- N'invente PAS de compétences ou expériences non mentionnées
- Utilise le prénom du candidat pour signer

Réponds UNIQUEMENT avec le texte de la lettre, sans commentaire.`;

    const userPrompt = `Rédige une lettre de motivation pour:

CANDIDAT:
- Prénom: ${candidatInfo.prenom}
- Nom: ${candidatInfo.nom}
- Compétences: ${candidatInfo.competences}
- Expériences: ${candidatInfo.experiences}
- Formations: ${candidatInfo.formations}
- Ville: ${candidatInfo.ville}

OFFRE:
- Poste: ${offreInfo.titre}
- Entreprise: ${offreInfo.entreprise}
- Description: ${offreInfo.description}
- Compétences requises: ${offreInfo.competences_requises}
- Lieu: ${offreInfo.lieu}
- Type de contrat: ${offreInfo.type_contrat}`;

    const aiResponse = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`Erreur AI Gateway: ${aiResponse.status} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const letterContent = aiData.choices?.[0]?.message?.content;
    logStep("Letter generated", { letterLength: letterContent?.length });

    // If candidatureId provided, update the candidature
    if (candidatureId) {
      // For now, we just log - in future could store the letter URL
      logStep("Candidature will be updated", { candidatureId });
    }

    // Log activity
    await supabaseClient.rpc('log_activity', {
      _user_id: user.id,
      _type_action: 'APPLICATION_SENT',
      _details: { 
        offre_id: offreId,
        offre_titre: offre.titre,
        entreprise: offre.entreprise,
        candidature_id: candidatureId
      },
      _visible_candidat: true
    });

    return new Response(JSON.stringify({
      success: true,
      letter: letterContent,
      offre: {
        id: offre.id,
        titre: offre.titre,
        entreprise: offre.entreprise
      },
      candidat: {
        prenom: candidatInfo.prenom,
        nom: candidatInfo.nom
      }
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
