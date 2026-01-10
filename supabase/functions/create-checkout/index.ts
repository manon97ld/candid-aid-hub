import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mapping des plans vers les price_ids Stripe
const PRICE_MAP: Record<string, { price_id: string; mode: 'payment' | 'subscription' }> = {
  // Mode Assisté
  pack_8: { price_id: 'price_1ShUudFsDZcbsdOtjsdMr18A', mode: 'payment' }, // 20€
  mensuel_30: { price_id: 'price_1SmBmZFsDZcbsdOtiyaYTwQJ', mode: 'subscription' }, // 30€/mois
  pack_15: { price_id: 'price_1ShUvMFsDZcbsdOtG90oFTm6', mode: 'payment' }, // 40€
  // Mode Délégation
  premium_mensuel: { price_id: 'price_1SmBmxFsDZcbsdOtF1HZBzmZ', mode: 'subscription' }, // 120€/mois = 60€ x2 ?
  premium_trimestriel: { price_id: 'price_1SmBmxFsDZcbsdOtF1HZBzmZ', mode: 'subscription' }, // Use same for now
  // Frais de dossier
  frais_dossier: { price_id: 'price_1ShUwMFsDZcbsdOtBw3SLZJd', mode: 'payment' }, // 5€
};

const logStep = (step: string, details?: unknown) => {
  console.log(`[CREATE-CHECKOUT] ${step}`, details ? JSON.stringify(details) : '');
};

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

    // Get request body
    const { planType, mode, email: guestEmail } = await req.json();
    logStep("Request received", { planType, mode, guestEmail });

    let userEmail = guestEmail;
    let userId: string | null = null;

    // Try to get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user?.email) {
        userEmail = data.user.email;
        userId = data.user.id;
        logStep("User authenticated", { userId, email: userEmail });
      }
    }

    if (!userEmail) {
      throw new Error("Email requis pour le checkout");
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY non configuré");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check for existing customer
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Customer found", { customerId });
    }

    // Get price config
    const priceConfig = PRICE_MAP[planType];
    if (!priceConfig && planType !== 'gratuit') {
      throw new Error(`Plan non reconnu: ${planType}`);
    }

    // For free plan, just return success
    if (planType === 'gratuit') {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Plan gratuit activé" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const lineItems = [{ price: priceConfig.price_id, quantity: 1 }];

    // Add frais de dossier for first time (one-time)
    if (['pack_8', 'pack_15', 'premium_mensuel', 'premium_trimestriel'].includes(planType)) {
      lineItems.push({ price: PRICE_MAP.frais_dossier.price_id, quantity: 1 });
    }

    const origin = req.headers.get("origin") || "https://soynrumbnpkplefhwsbg.lovableproject.com";
    
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: lineItems,
      mode: priceConfig.mode,
      success_url: `${origin}/app/candidat?checkout=success&plan=${planType}`,
      cancel_url: `${origin}/inscription?checkout=cancelled`,
      metadata: {
        user_id: userId || '',
        plan_type: planType,
        mode_service: mode,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
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
