'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchAllDifficultyStats, DifficultyStats } from '@/lib/data/difficulty';

export function useDifficultyStats() {
  const [stats, setStats] = useState<Map<string, DifficultyStats>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllDifficultyStats();
      setStats(new Map(data.map((d) => [d.use_case_id, d])));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, isLoading, refresh: load };
}
