'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchDifficulty, fetchUserRating, rateDifficulty, DifficultyStats } from '@/lib/data/difficulty';

export function useDifficulty(useCaseId: string, userId?: string) {
  const [stats, setStats] = useState<DifficultyStats | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsData, ratingData] = await Promise.all([
        fetchDifficulty(useCaseId),
        userId ? fetchUserRating(userId, useCaseId) : Promise.resolve(null),
      ]);
      setStats(statsData);
      setUserRating(ratingData);
    } finally {
      setIsLoading(false);
    }
  }, [useCaseId, userId]);

  useEffect(() => {
    load();
  }, [load]);

  const rate = useCallback(async (rating: number) => {
    if (!userId) return;
    await rateDifficulty(userId, useCaseId, rating);
    setUserRating(rating);
    // Refresh stats
    const updated = await fetchDifficulty(useCaseId);
    setStats(updated);
  }, [userId, useCaseId]);

  return { stats, userRating, rate, isLoading };
}
