'use client';

import { useMemo } from 'react';
import { useTheme } from '@/lib/theme';
import { getRank, getNextRank } from '@/lib/rank';

export function useRank(points: number) {
  const { t } = useTheme();

  return useMemo(() => {
    const current = getRank(points, t.ranks);
    const next = getNextRank(points, t.ranks);

    return {
      current,
      next,
      points,
      completedCount: Math.floor(points / 10), // For backwards compatibility
    };
  }, [points, t.ranks]);
}
