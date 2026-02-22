'use client';

import { useThemeContext } from './ThemeProvider';
import type { ContentTheme, VisualTheme } from './types';

export function useTheme() {
  const { content, visual, themeKey, setThemeKey } = useThemeContext();
  return { content, visual, t: content, themeKey, setThemeKey };
}

export type { ContentTheme, VisualTheme };
