'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchUserProgress, UserProgressItem } from '@/lib/data/progress';

export function useProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<UserProgressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await fetchUserProgress(userId);
      setProgress(data);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const completedCount = progress.filter((p) => p.is_completed).length;
  const inProgressCount = progress.filter((p) => !p.is_completed).length;

  return { progress, completedCount, inProgressCount, isLoading, refresh: load };
}
