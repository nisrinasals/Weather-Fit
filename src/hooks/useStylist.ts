import { useState, useCallback } from 'react';
import type { WeatherData } from '../types';

interface StylistResult {
  weather: WeatherData;
  verdict: string;
  advice: string;
}

export function useStylist() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StylistResult | null>(null);

  const checkOutfit = useCallback(async (outfit: string, lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/stylist-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ outfit, lat, lon }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze outfit');
      }

      const data: StylistResult = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { checkOutfit, reset, isLoading, error, result };
}
