'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchUseCaseWithProgress, UseCaseWithProgress } from '@/lib/data/use-cases';

export function useUseCase(id: string, userId: string | undefined) {
  const [useCase, setUseCase] = useState<UseCaseWithProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await fetchUseCaseWithProgress(id, userId);
      setUseCase(data);
    } finally {
      setIsLoading(false);
    }
  }, [id, userId]);

  useEffect(() => { load(); }, [load]);

  return { useCase, isLoading, refresh: load };
}
