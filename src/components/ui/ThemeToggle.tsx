'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/theme';
import type { ThemeKey } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { updateUserTheme } from '@/lib/auth/utils/database';
import { saveThemePreference } from '@/lib/auth/utils/storage';

const THEME_ORDER: ThemeKey[] = ['cult', 'corporate', 'academic', 'startup', 'scifi', 'retro', 'nerdy', 'consulting'];

const THEME_LABELS: Record<ThemeKey, string> = {
  cult: 'Conspiracy Mode',
  corporate: 'Corporate Mode',
  academic: 'Academic Mode',
  startup: 'Startup Mode',
  scifi: 'Sci-Fi Mode',
  retro: 'Retro Mode',
  nerdy: 'Nerdy Mode',
  consulting: 'Consulting Mode',
};

export function ThemeToggle() {
  const { themeKey, setThemeKey } = useTheme();
  const { user, setUser } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleToggle = async () => {
    const currentIndex = THEME_ORDER.indexOf(themeKey);
    const newKey = THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length];

    // Apply immediately (optimistic)
    setThemeKey(newKey);
    saveThemePreference(newKey);

    // Persist to database
    if (user) {
      setSaving(true);
      try {
        const updated = await updateUserTheme(user.id, newKey);
        setUser(updated);
      } catch {
        // Revert on failure
        setThemeKey(themeKey);
        saveThemePreference(themeKey);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={saving}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer"
      style={{
        background: 'var(--color-bg-elevated, var(--color-bg-surface))',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border)',
        opacity: saving ? 0.6 : 1,
      }}
    >
      <span>{THEME_LABELS[themeKey] || themeKey}</span>
    </button>
  );
}
