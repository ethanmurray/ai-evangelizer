'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchDifficulty, fetchUserRating, rateDifficulty, DifficultyStats } from '@/lib/data/difficulty';

export function useDifficulty(useCaseId: string, userId?: string) {
  const [stats, setStats] = useState<DifficultyStats | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    try {
      await rateDifficulty(userId, useCaseId, rating);
      setUserRating(rating);
      // Refresh stats
      const updated = await fetchDifficulty(useCaseId);
      setStats(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to save rating');
    }
  }, [userId, useCaseId]);

  return { stats, userRating, rate, isLoading, error };
}
