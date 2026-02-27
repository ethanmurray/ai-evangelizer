'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import type { ThemeKey } from '@/lib/theme';
import { saveThemePreference } from '@/lib/auth/utils/storage';
import { isThemeUnlocked } from '@/lib/theme/themeUnlocks';
import { fetchUserPoints } from '@/lib/data/points';

export function ThemeSyncer() {
  const { user } = useAuth();
  const { setThemeKey } = useTheme();

  useEffect(() => {
    if (user?.themePreference) {
      // Verify the stored theme is still unlocked before applying
      fetchUserPoints(user.id).then((points) => {
        const pref = user.themePreference as ThemeKey;
        if (isThemeUnlocked(pref, points)) {
          setThemeKey(pref);
          saveThemePreference(user.themePreference);
        } else {
          // Fall back to default if theme is locked
          const defaultKey = (process.env.NEXT_PUBLIC_CONTENT_THEME || 'corporate') as ThemeKey;
          setThemeKey(defaultKey);
          saveThemePreference(defaultKey);
        }
      });
    } else if (user === null) {
      const defaultKey = (process.env.NEXT_PUBLIC_CONTENT_THEME || 'corporate') as ThemeKey;
      setThemeKey(defaultKey);
      saveThemePreference(null);
    }
  }, [user, setThemeKey]);

  return null;
}
