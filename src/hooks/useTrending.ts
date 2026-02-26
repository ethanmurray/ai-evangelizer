'use client';

import { useState, useEffect } from 'react';
import { fetchTrendingUseCases, type TrendingUseCase } from '@/lib/data/trending';

export function useTrending(days: number = 7, limit: number = 5) {
  const [trending, setTrending] = useState<TrendingUseCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrendingUseCases(days, limit)
      .then(setTrending)
      .finally(() => setIsLoading(false));
  }, [days, limit]);

  return { trending, isLoading };
}
