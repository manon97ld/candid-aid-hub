import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  console.log(`[CHECK-SUBSCRIPTION] ${step}`, details ? JSON.stringify(details) : '');
};

// Map product IDs to plan types
const PRODUCT_PLAN_MAP: Record<string, string> = {
  'prod_Tjf6ghgtcKmsjg': 'mensuel_30', // mode assisté abo mensuel
  'prod_Tjf7LnvQRBPwuf': 'premium_mensuel', // mode délégation abo mensuel
  'prod_Tjf8n9Y3Cb4dvx': 'recruteur_200', // mode recruteur 200e
  'prod_Tjf8RYa0KqnrKf': 'recruteur_500', // mode recruteur 500e
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY non configuré");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Authorization header manquant");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Erreur auth: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("Utilisateur non authentifié");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Find customer by email
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found");
      return new Response(JSON.stringify({ 
        subscribed: false,
        plan_type: 'gratuit',
        mode_service: 'autonome'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found customer", { customerId });

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    let subscribed = false;
    let planType = 'gratuit';
    let subscriptionEnd: string | null = null;
    let modeService = 'autonome';

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      subscribed = true;
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      
      const productId = subscription.items.data[0]?.price?.product as string;
      planType = PRODUCT_PLAN_MAP[productId] || 'unknown';
      
      // Determine mode from plan
      if (planType.includes('premium') || planType.includes('delegation')) {
        modeService = 'delegation';
      } else if (planType.includes('mensuel') || planType.includes('pack')) {
        modeService = 'assiste';
      }
      
      logStep("Active subscription found", { 
        subscriptionId: subscription.id, 
        planType, 
        modeService,
        endDate: subscriptionEnd 
      });
    }

    // Also check for recent successful one-time payments (packs)
    if (!subscribed) {
      const sessions = await stripe.checkout.sessions.list({
        customer: customerId,
        limit: 5,
      });

      for (const session of sessions.data) {
        if (session.payment_status === 'paid' && session.metadata?.plan_type) {
          const sessionPlan = session.metadata.plan_type;
          if (['pack_8', 'pack_15'].includes(sessionPlan)) {
            planType = sessionPlan;
            modeService = 'assiste';
            subscribed = true;
            logStep("Found pack purchase", { sessionId: session.id, planType });
            break;
          }
        }
      }
    }

    return new Response(JSON.stringify({
      subscribed,
      plan_type: planType,
      mode_service: modeService,
      subscription_end: subscriptionEnd,
      customer_id: customerId
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
