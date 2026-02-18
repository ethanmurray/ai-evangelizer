'use client';

import { useThemeContext } from './ThemeProvider';
import type { ContentTheme, VisualTheme } from './types';

export function useTheme() {
  const { content, visual } = useThemeContext();
  return { content, visual, t: content };
}

export type { ContentTheme, VisualTheme };
