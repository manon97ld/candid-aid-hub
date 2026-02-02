import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const logStep = (step: string, details?: unknown) => {
  console.log(`[PARSE-CV] ${step}`, details ? JSON.stringify(details) : '');
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

    const { cvText, candidatId } = await req.json();
    logStep("Request received", { candidatId, cvTextLength: cvText?.length });

    if (!cvText) {
      throw new Error("Texte du CV requis");
    }

    // Prompt for CV parsing
    const systemPrompt = `Tu es un expert en analyse de CV. Analyse le CV fourni et extrait les informations suivantes au format JSON strict:
{
  "nom": "string ou null",
  "prenom": "string ou null", 
  "email": "string ou null",
  "telephone": "string ou null",
  "adresse": "string ou null",
  "ville": "string ou null",
  "code_postal": "string ou null",
  "experiences": [
    {
      "poste": "string",
      "entreprise": "string",
      "periode": "string",
      "description": "string"
    }
  ],
  "formations": [
    {
      "diplome": "string",
      "etablissement": "string",
      "annee": "string"
    }
  ],
  "competences_techniques": ["string"],
  "competences_autres": ["string"],
  "langues": [
    {
      "langue": "string",
      "niveau": "string"
    }
  ],
  "permis_conduire": boolean,
  "categories_permis": ["string"],
  "vehicule_personnel": boolean,
  "score_qualite_cv": number (0-100),
  "points_amelioration": ["string"]
}

Réponds UNIQUEMENT avec le JSON, sans explication.`;

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
          { role: "user", content: `Voici le CV à analyser:\n\n${cvText}` }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`Erreur AI Gateway: ${aiResponse.status} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;
    logStep("AI response received", { contentLength: content?.length });

    // Parse JSON from response
    let parsedData;
    try {
      // Clean potential markdown code blocks
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleanContent);
    } catch (parseError) {
      logStep("JSON parse error, using raw response", { error: parseError });
      parsedData = { raw_content: content, parse_error: true };
    }

    // If candidatId provided, update the candidat record
    if (candidatId) {
      const updateData: Record<string, unknown> = {
        competences_techniques: parsedData.competences_techniques?.join(', ') || null,
        competences_autres: parsedData.competences_autres?.join(', ') || null,
        experiences: parsedData.experiences || [],
        formations: parsedData.formations || [],
        permis_conduire: parsedData.permis_conduire || false,
        categories_permis: parsedData.categories_permis || [],
        vehicule_personnel: parsedData.vehicule_personnel || false,
        progression_profil: Math.min((parsedData.score_qualite_cv || 0), 100),
      };

      const { error: updateError } = await supabaseClient
        .from('candidats')
        .update(updateData)
        .eq('id', candidatId)
        .eq('user_id', user.id);

      if (updateError) {
        logStep("Error updating candidat", { error: updateError });
      } else {
        logStep("Candidat updated with parsed CV data");
      }

      // Log activity
      await supabaseClient.rpc('log_activity', {
        _user_id: user.id,
        _type_action: 'CV_PARSED',
        _details: { 
          candidat_id: candidatId,
          score_qualite: parsedData.score_qualite_cv,
          competences_count: parsedData.competences_techniques?.length || 0
        },
        _visible_candidat: true
      });
    }

    return new Response(JSON.stringify({
      success: true,
      parsed: parsedData,
      score_qualite: parsedData.score_qualite_cv || 0,
      points_amelioration: parsedData.points_amelioration || []
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
