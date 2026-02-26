'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import type { ThemeKey } from '@/lib/theme';
import { saveThemePreference } from '@/lib/auth/utils/storage';

export function ThemeSyncer() {
  const { user } = useAuth();
  const { setThemeKey } = useTheme();

  useEffect(() => {
    if (user?.themePreference) {
      setThemeKey(user.themePreference as ThemeKey);
      saveThemePreference(user.themePreference);
    } else if (user === null) {
      const defaultKey = (process.env.NEXT_PUBLIC_CONTENT_THEME || 'cult') as ThemeKey;
      setThemeKey(defaultKey);
      saveThemePreference(null);
    }
  }, [user, setThemeKey]);

  return null;
}
