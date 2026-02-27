'use client';

import { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/ToastContainer';
import { getNewlyUnlockedThemes } from '@/lib/theme/themeUnlocks';

export function useThemeUnlockCheck(userPoints: number) {
  const { showToast } = useToast();
  const prevPointsRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevPointsRef.current === null) {
      prevPointsRef.current = userPoints;
      return;
    }

    const newlyUnlocked = getNewlyUnlockedThemes(prevPointsRef.current, userPoints);
    for (const theme of newlyUnlocked) {
      showToast(
        'New Theme Unlocked!',
        `You've earned enough points to use ${theme.label}! Check the theme picker to try it out.`
      );
    }

    prevPointsRef.current = userPoints;
  }, [userPoints, showToast]);
}
