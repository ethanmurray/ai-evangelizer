'use client';

import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { ContentTheme, VisualTheme, AppTheme } from './types';
import { cultTheme, corporateTheme } from './mergeSlices';
import { getStoredThemePreference } from '@/lib/auth/utils/storage';

const contentThemes: Record<string, ContentTheme> = {
  cult: cultTheme,
  corporate: corporateTheme,
};

const visualThemes: Record<string, VisualTheme> = {
  'conspiracy-board': { name: 'Conspiracy Board', cssClass: 'conspiracy-board' },
  clean: { name: 'Clean', cssClass: 'clean' },
};

const THEME_PAIRS: Record<string, string> = {
  cult: 'conspiracy-board',
  corporate: 'clean',
};

export interface ThemeContextType extends AppTheme {
  themeKey: 'cult' | 'corporate';
  setThemeKey: (key: 'cult' | 'corporate') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialThemeKey(): 'cult' | 'corporate' {
  if (typeof window !== 'undefined') {
    const stored = getStoredThemePreference();
    if (stored) return stored;
  }
  const envKey = process.env.NEXT_PUBLIC_CONTENT_THEME;
  if (envKey === 'cult' || envKey === 'corporate') return envKey;
  return 'cult';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeKey, setThemeKeyState] = useState<'cult' | 'corporate'>(getInitialThemeKey);

  const setThemeKey = useCallback((key: 'cult' | 'corporate') => {
    setThemeKeyState(key);
  }, []);

  // Apply visual theme to <html> element reactively
  useEffect(() => {
    const visualKey = THEME_PAIRS[themeKey] || 'conspiracy-board';
    document.documentElement.setAttribute('data-visual-theme', visualKey);
  }, [themeKey]);

  const value = useMemo<ThemeContextType>(() => {
    const visualKey = THEME_PAIRS[themeKey] || 'conspiracy-board';
    return {
      content: contentThemes[themeKey] || cultTheme,
      visual: visualThemes[visualKey] || visualThemes['conspiracy-board'],
      themeKey,
      setThemeKey,
    };
  }, [themeKey, setThemeKey]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
