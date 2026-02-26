'use client';

import { useThemeContext } from './ThemeProvider';
import type { ContentTheme, VisualTheme } from './types';

export function useTheme() {
  const { content, visual, themeKey, setThemeKey, darkMode, toggleDarkMode } = useThemeContext();
  return { content, visual, t: content, themeKey, setThemeKey, darkMode, toggleDarkMode };
}

export type { ContentTheme, VisualTheme };
