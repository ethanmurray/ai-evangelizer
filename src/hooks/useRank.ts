'use client';

import { useMemo } from 'react';
import { useTheme } from '@/lib/theme';
import { getRank, getNextRank } from '@/lib/rank';

export function useRank(completedCount: number) {
  const { t } = useTheme();

  return useMemo(() => {
    const current = getRank(completedCount, t.ranks);
    const next = getNextRank(completedCount, t.ranks);

    return {
      current,
      next,
      completedCount,
    };
  }, [completedCount, t.ranks]);
}
