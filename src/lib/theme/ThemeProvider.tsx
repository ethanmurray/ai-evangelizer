'use client';

import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { ContentTheme, VisualTheme, AppTheme } from './types';
import { cultTheme, corporateTheme, academicTheme, startupTheme, scifiTheme, retroTheme, nerdyTheme, consultingTheme, pirateTheme, noirTheme, medievalTheme } from './mergeSlices';
import { getStoredThemePreference } from '@/lib/auth/utils/storage';

export type ThemeKey = 'cult' | 'corporate' | 'academic' | 'startup' | 'scifi' | 'retro' | 'nerdy' | 'consulting' | 'pirate' | 'noir' | 'medieval';

const DARK_MODE_KEY = 'cult_of_ai_dark_mode';

const contentThemes: Record<ThemeKey, ContentTheme> = {
  cult: cultTheme,
  corporate: corporateTheme,
  academic: academicTheme,
  startup: startupTheme,
  scifi: scifiTheme,
  retro: retroTheme,
  nerdy: nerdyTheme,
  consulting: consultingTheme,
  pirate: pirateTheme,
  noir: noirTheme,
  medieval: medievalTheme,
};

const visualThemes: Record<string, VisualTheme> = {
  'conspiracy-board': { name: 'Conspiracy Board', cssClass: 'conspiracy-board' },
  'conspiracy-board-light': { name: 'Conspiracy Board Light', cssClass: 'conspiracy-board-light' },
  clean: { name: 'Clean', cssClass: 'clean' },
  'clean-dark': { name: 'Clean Dark', cssClass: 'clean-dark' },
  noir: { name: 'Noir', cssClass: 'noir' },
  'noir-light': { name: 'Noir Light', cssClass: 'noir-light' },
};

// Themes that use the conspiracy-board visual style; all others use clean
const CONSPIRACY_THEMES: Set<ThemeKey> = new Set(['cult', 'scifi', 'retro', 'nerdy', 'pirate', 'medieval']);

function getVisualThemeKey(contentKey: string, darkMode: boolean): string {
  if (contentKey === 'noir') {
    return darkMode ? 'noir' : 'noir-light';
  }
  if (CONSPIRACY_THEMES.has(contentKey as ThemeKey)) {
    return darkMode ? 'conspiracy-board' : 'conspiracy-board-light';
  }
  return darkMode ? 'clean-dark' : 'clean';
}

const VALID_THEME_KEYS: Set<string> = new Set<string>(Object.keys(contentThemes));

export interface ThemeContextType extends AppTheme {
  themeKey: ThemeKey;
  setThemeKey: (key: ThemeKey) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialThemeKey(): ThemeKey {
  if (typeof window !== 'undefined') {
    const stored = getStoredThemePreference();
    if (stored && VALID_THEME_KEYS.has(stored)) return stored as ThemeKey;
  }
  const envKey = process.env.NEXT_PUBLIC_CONTENT_THEME;
  if (envKey && VALID_THEME_KEYS.has(envKey)) return envKey as ThemeKey;
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
  const [themeKey, setThemeKeyState] = useState<ThemeKey>(getInitialThemeKey);
  const [darkMode, setDarkMode] = useState<boolean>(getInitialDarkMode);

  const setThemeKey = useCallback((key: ThemeKey) => {
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
