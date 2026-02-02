import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Helper to get auth headers
async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }
  return headers;
}

// ============ CV PARSING ============

export interface ParsedCV {
  nom: string | null;
  prenom: string | null;
  email: string | null;
  telephone: string | null;
  adresse: string | null;
  ville: string | null;
  code_postal: string | null;
  experiences: Array<{
    poste: string;
    entreprise: string;
    periode: string;
    description: string;
  }>;
  formations: Array<{
    diplome: string;
    etablissement: string;
    annee: string;
  }>;
  competences_techniques: string[];
  competences_autres: string[];
  langues: Array<{
    langue: string;
    niveau: string;
  }>;
  permis_conduire: boolean;
  categories_permis: string[];
  vehicule_personnel: boolean;
  score_qualite_cv: number;
  points_amelioration: string[];
}

export async function parseCV(cvText: string, candidatId?: string): Promise<{
  success: boolean;
  parsed?: ParsedCV;
  score_qualite?: number;
  points_amelioration?: string[];
  error?: string;
}> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${SUPABASE_URL}/functions/v1/parse-cv`, {
      method: "POST",
      headers,
      body: JSON.stringify({ cvText, candidatId }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Erreur lors du parsing du CV");
    }

    return data;
  } catch (error) {
    console.error("Error parsing CV:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

// ============ MATCHING ============

export interface MatchedOffer {
  id: string;
  titre: string;
  entreprise: string | null;
  lieu: string | null;
  ville: string | null;
  type_contrat: string | null;
  description: string | null;
  domaine: string | null;
  date_publication: string | null;
  score_matching: number;
  raisons_matching: string[];
  lien_candidature: string | null;
}

export async function getMatchedOffers(options?: {
  limit?: number;
  minScore?: number;
}): Promise<{
  success: boolean;
  offers?: MatchedOffer[];
  matched_count?: number;
  total_offres?: number;
  error?: string;
}> {
  try {
    const headers = await getAuthHeaders();
    const params = new URLSearchParams();
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.minScore) params.append("min_score", options.minScore.toString());

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/match-offers?${params.toString()}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Erreur lors du matching");
    }

    return data;
  } catch (error) {
    console.error("Error matching offers:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

// ============ LETTER GENERATION ============

export async function generateMotivationLetter(
  offreId: string,
  candidatureId?: string
): Promise<{
  success: boolean;
  letter?: string;
  offre?: { id: string; titre: string; entreprise: string };
  candidat?: { prenom: string; nom: string };
  error?: string;
}> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-letter`, {
      method: "POST",
      headers,
      body: JSON.stringify({ offreId, candidatureId }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la génération");
    }

    return data;
  } catch (error) {
    console.error("Error generating letter:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

// ============ OFFERS ============

export async function fetchOffersFromForem(options?: {
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<{
  success: boolean;
  offers?: Array<{
    id: string;
    titre: string;
    entreprise: string;
    lieu: string;
    type_contrat: string;
    description: string;
    source: string;
  }>;
  total?: number;
  error?: string;
}> {
  try {
    const headers = await getAuthHeaders();
    const params = new URLSearchParams();
    if (options?.q) params.append("q", options.q);
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.offset) params.append("offset", options.offset.toString());

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/fetch-offers?${params.toString()}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();
    return {
      success: !data.error,
      offers: data.offers,
      total: data.total,
      error: data.error,
    };
  } catch (error) {
    console.error("Error fetching offers:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

// ============ CHECKOUT ============

export async function createCheckoutSession(
  planType: string,
  mode: string,
  email?: string
): Promise<{
  success: boolean;
  url?: string;
  message?: string;
  error?: string;
}> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
      method: "POST",
      headers,
      body: JSON.stringify({ planType, mode, email }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la création du checkout");
    }

    return {
      success: true,
      url: data.url,
      message: data.message,
    };
  } catch (error) {
    console.error("Error creating checkout:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

// ============ CANDIDATURES ============

export async function createCandidature(
  offreId: string,
  options?: {
    generateLetter?: boolean;
  }
): Promise<{
  success: boolean;
  candidature?: {
    id: string;
    statut: string;
  };
  letter?: string;
  error?: string;
}> {
  try {
    // Get current user's candidat ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Non authentifié");

    const { data: candidat, error: candidatError } = await supabase
      .from("candidats")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (candidatError || !candidat) {
      throw new Error("Profil candidat non trouvé");
    }

    // Create candidature
    const { data: candidature, error: insertError } = await supabase
      .from("candidatures")
      .insert({
        candidat_id: candidat.id,
        offre_id: offreId,
        statut: "proposee",
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    let letter: string | undefined;

    // Generate letter if requested
    if (options?.generateLetter) {
      const letterResult = await generateMotivationLetter(offreId, candidature.id);
      if (letterResult.success) {
        letter = letterResult.letter;
      }
    }

    return {
      success: true,
      candidature: {
        id: candidature.id,
        statut: candidature.statut,
      },
      letter,
    };
  } catch (error) {
    console.error("Error creating candidature:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

export async function updateCandidatureStatus(
  candidatureId: string,
  statut: "proposee" | "approuvee" | "envoyee" | "entretien" | "refusee" | "abandonnee"
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase
      .from("candidatures")
      .update({ 
        statut,
        date_envoi: statut === "envoyee" ? new Date().toISOString() : undefined
      })
      .eq("id", candidatureId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error updating candidature:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
