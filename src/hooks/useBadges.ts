'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchUserBadges, BADGE_DEFINITIONS, UserBadge } from '@/lib/data/badges';

export function useBadges(userId: string | undefined) {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await fetchUserBadges(userId);
      setBadges(data);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    badges,
    allBadges: BADGE_DEFINITIONS,
    isLoading,
    refresh: load,
  };
}
