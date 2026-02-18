'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { ContentTheme, VisualTheme, AppTheme } from './types';
import { cultTheme } from './content/cult';
import { corporateTheme } from './content/corporate';

const contentThemes: Record<string, ContentTheme> = {
  cult: cultTheme,
  corporate: corporateTheme,
};

const visualThemes: Record<string, VisualTheme> = {
  'conspiracy-board': { name: 'Conspiracy Board', cssClass: 'conspiracy-board' },
  clean: { name: 'Clean', cssClass: 'clean' },
};

const ThemeContext = createContext<AppTheme | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useMemo<AppTheme>(() => {
    const contentKey = process.env.NEXT_PUBLIC_CONTENT_THEME || 'cult';
    const visualKey = process.env.NEXT_PUBLIC_VISUAL_THEME || 'conspiracy-board';

    return {
      content: contentThemes[contentKey] || cultTheme,
      visual: visualThemes[visualKey] || visualThemes['conspiracy-board'],
    };
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): AppTheme {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
