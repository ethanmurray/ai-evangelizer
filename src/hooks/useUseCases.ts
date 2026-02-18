'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchUseCases, UseCase } from '@/lib/data/use-cases';

export function useUseCases(search?: string) {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchUseCases(search);
      setUseCases(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  return { useCases, isLoading, error, refresh: load };
}
