'use client';

import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { ContentTheme, VisualTheme, AppTheme } from './types';
import { cultTheme, corporateTheme } from './mergeSlices';
import { getStoredThemePreference } from '@/lib/auth/utils/storage';

const DARK_MODE_KEY = 'cult_of_ai_dark_mode';

const contentThemes: Record<string, ContentTheme> = {
  cult: cultTheme,
  corporate: corporateTheme,
};

const visualThemes: Record<string, VisualTheme> = {
  'conspiracy-board': { name: 'Conspiracy Board', cssClass: 'conspiracy-board' },
  'conspiracy-board-light': { name: 'Conspiracy Board Light', cssClass: 'conspiracy-board-light' },
  clean: { name: 'Clean', cssClass: 'clean' },
  'clean-dark': { name: 'Clean Dark', cssClass: 'clean-dark' },
};

function getVisualThemeKey(contentKey: string, darkMode: boolean): string {
  if (contentKey === 'cult') return darkMode ? 'conspiracy-board' : 'conspiracy-board-light';
  return darkMode ? 'clean-dark' : 'clean';
}

export interface ThemeContextType extends AppTheme {
  themeKey: 'cult' | 'corporate';
  setThemeKey: (key: 'cult' | 'corporate') => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
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

function getInitialDarkMode(): boolean {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) return stored === 'true';
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return true; // default to dark for SSR
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeKey, setThemeKeyState] = useState<'cult' | 'corporate'>(getInitialThemeKey);
  const [darkMode, setDarkMode] = useState<boolean>(getInitialDarkMode);

  const setThemeKey = useCallback((key: 'cult' | 'corporate') => {
    setThemeKeyState(key);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem(DARK_MODE_KEY, String(next));
      return next;
    });
  }, []);

  // Apply visual theme to <html> element reactively
  useEffect(() => {
    const visualKey = getVisualThemeKey(themeKey, darkMode);
    document.documentElement.setAttribute('data-visual-theme', visualKey);
  }, [themeKey, darkMode]);

  const value = useMemo<ThemeContextType>(() => {
    const visualKey = getVisualThemeKey(themeKey, darkMode);
    return {
      content: contentThemes[themeKey] || cultTheme,
      visual: visualThemes[visualKey] || visualThemes['conspiracy-board'],
      themeKey,
      setThemeKey,
      darkMode,
      toggleDarkMode,
    };
  }, [themeKey, setThemeKey, darkMode, toggleDarkMode]);

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
