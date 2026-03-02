'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchDailyChallengeStatus,
  type DailyChallengeStatus,
} from '@/lib/data/dailyChallenge';

export function useDailyChallenge(userId: string | undefined) {
  const [status, setStatus] = useState<DailyChallengeStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await fetchDailyChallengeStatus(userId);
      setStatus(data);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    challenges: status?.challenges ?? [],
    completedType: status?.completedType ?? null,
    streak: status?.streak ?? 0,
    date: status?.date ?? '',
    isWorkday: status?.isWorkday ?? true,
    isLoading,
    refresh: load,
  };
}
