'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFollowStatus, setFollow, type FollowFrequency } from '@/lib/data/follows';

export function useFollow(useCaseId: string, userId: string | undefined) {
  const [frequency, setFrequency] = useState<FollowFrequency | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getFollowStatus(userId, useCaseId).then(setFrequency);
  }, [userId, useCaseId]);

  const updateFollow = useCallback(async (newFrequency: FollowFrequency) => {
    if (!userId) return;
    setIsLoading(true);
    try {
      await setFollow(userId, useCaseId, newFrequency);
      setFrequency(newFrequency);
    } finally {
      setIsLoading(false);
    }
  }, [userId, useCaseId]);

  return { frequency, updateFollow, isLoading };
}
