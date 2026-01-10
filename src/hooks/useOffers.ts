import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Offer, OffersResponse } from '@/types/offers';

export function useOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchOffers = useCallback(async (query = '', limit = 20, offset = 0) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('fetch-offers', {
        body: null,
        headers: {},
      });

      // Use query params via URL reconstruction
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-offers?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des offres');
      }

      const result: OffersResponse = await response.json();
      
      setOffers(result.offers || []);
      setTotal(result.total || 0);
      
      if (result.error) {
        console.warn('Offers API warning:', result.error);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      console.error('Fetch offers error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { offers, loading, error, total, fetchOffers };
}
