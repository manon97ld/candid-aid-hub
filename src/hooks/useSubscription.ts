import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionStatus {
  subscribed: boolean;
  plan_type: string;
  mode_service: string;
  subscription_end: string | null;
  customer_id?: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setStatus(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('check-subscription');
      
      if (fnError) throw fnError;
      
      setStatus(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      console.error('Check subscription error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const openCustomerPortal = useCallback(async () => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke('customer-portal');
      
      if (fnError) throw fnError;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Customer portal error:', err);
      throw err;
    }
  }, []);

  const createCheckout = useCallback(async (planType: string, mode: string) => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-checkout', {
        body: { planType, mode },
      });
      
      if (fnError) throw fnError;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
      
      return data;
    } catch (err) {
      console.error('Create checkout error:', err);
      throw err;
    }
  }, []);

  // Auto-check on mount and when user changes
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Periodic refresh every minute
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  return { 
    status, 
    loading, 
    error, 
    checkSubscription, 
    openCustomerPortal,
    createCheckout 
  };
}
