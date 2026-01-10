import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const N8N_WEBHOOK_URL = "https://n8n.srv1152388.hstgr.cloud/webhook/forem/offers";

const logStep = (step: string, details?: unknown) => {
  console.log(`[FETCH-OFFERS] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    const limit = url.searchParams.get("limit") || "20";
    const offset = url.searchParams.get("offset") || "0";

    logStep("Params", { q, limit, offset });

    // Call n8n webhook
    const n8nUrl = `${N8N_WEBHOOK_URL}?q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}`;
    logStep("Calling n8n", { url: n8nUrl });

    const response = await fetch(n8nUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`n8n returned ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    logStep("n8n response received", { recordCount: data?.results?.length || 0 });

    // Transform the data for our frontend
    const offers = (data?.results || []).map((record: any) => ({
      id: record.numero_offre || record.id,
      titre: record.metier_ou_fonction || record.title,
      entreprise: record.raison_sociale || record.company,
      lieu: record.localite || record.location,
      code_postal: record.code_postal,
      type_contrat: record.type_d_engagement || record.contract_type,
      description: record.description_offre || record.description,
      date_publication: record.date_de_reception,
      source: "Forem",
      lien_candidature: `https://www.leforem.be/recherche-offres/offre-detail/${record.numero_offre}`,
      domaine: record.domaine_professionnel,
    }));

    return new Response(JSON.stringify({
      total: data?.total_count || offers.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      offers
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    // Return mock data in case of error for demo
    return new Response(JSON.stringify({
      total: 3,
      limit: 20,
      offset: 0,
      offers: [
        {
          id: "demo-1",
          titre: "Développeur Web Full Stack",
          entreprise: "Tech Solutions SA",
          lieu: "Bruxelles",
          code_postal: "1000",
          type_contrat: "CDI",
          description: "Nous recherchons un développeur expérimenté...",
          date_publication: new Date().toISOString(),
          source: "Demo",
          domaine: "Informatique"
        },
        {
          id: "demo-2", 
          titre: "Commercial B2B",
          entreprise: "Vente Pro SPRL",
          lieu: "Liège",
          code_postal: "4000",
          type_contrat: "CDI",
          description: "Rejoignez notre équipe commerciale dynamique...",
          date_publication: new Date().toISOString(),
          source: "Demo",
          domaine: "Commerce"
        },
        {
          id: "demo-3",
          titre: "Aide-soignant(e)",
          entreprise: "Maison de repos Les Tilleuls",
          lieu: "Namur",
          code_postal: "5000",
          type_contrat: "CDD",
          description: "Nous recherchons une personne motivée...",
          date_publication: new Date().toISOString(),
          source: "Demo",
          domaine: "Santé"
        }
      ],
      error: errorMessage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
