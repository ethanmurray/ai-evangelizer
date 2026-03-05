'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/lib/theme';
import { getRank } from '@/lib/rank';
import {
  fetchUserLevelPrizes,
  recordLevelPrize,
  fetchShippingAddress,
} from '@/lib/data/prizes';

interface LevelUpState {
  showModal: boolean;
  newRankName: string;
  needsAddress: boolean;
}

/**
 * Checks if the user has reached a new level that hasn't been recorded yet.
 * Returns state to control the level-up modal.
 */
export function useLevelUpCheck(userId: string | undefined, points: number) {
  const { t } = useTheme();
  const [state, setState] = useState<LevelUpState>({
    showModal: false,
    newRankName: '',
    needsAddress: false,
  });

  useEffect(() => {
    if (!userId || points <= 0) return;

    const currentRank = getRank(points, t.ranks);
    // Don't trigger for the starting rank
    if (currentRank.min === 0) return;

    let cancelled = false;

    (async () => {
      const [prizes, address] = await Promise.all([
        fetchUserLevelPrizes(userId),
        fetchShippingAddress(userId),
      ]);

      if (cancelled) return;

      const recordedMins = new Set(prizes.map((p) => p.rank_min_points));

      // Check if the current rank has been recorded
      if (!recordedMins.has(currentRank.min)) {
        // Record the prize
        await recordLevelPrize(userId, currentRank.name, currentRank.min);

        if (cancelled) return;

        setState({
          showModal: true,
          newRankName: currentRank.name,
          needsAddress: !address,
        });
      }
    })();

    return () => { cancelled = true; };
  }, [userId, points, t.ranks]);

  const dismiss = useCallback(() => {
    setState((s) => ({ ...s, showModal: false }));
  }, []);

  return { ...state, dismiss };
}
