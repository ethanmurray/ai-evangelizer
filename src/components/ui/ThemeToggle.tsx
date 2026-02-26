'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/theme';
import type { ThemeKey } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { updateUserTheme } from '@/lib/auth/utils/database';
import { saveThemePreference } from '@/lib/auth/utils/storage';

const THEME_OPTIONS: { key: ThemeKey; label: string }[] = [
  { key: 'cult', label: 'Conspiracy Mode' },
  { key: 'corporate', label: 'Corporate Mode' },
  { key: 'academic', label: 'Academic Mode' },
  { key: 'startup', label: 'Startup Mode' },
  { key: 'scifi', label: 'Sci-Fi Mode' },
  { key: 'retro', label: 'Retro Mode' },
  { key: 'nerdy', label: 'Nerdy Mode' },
  { key: 'consulting', label: 'Consulting Mode' },
];

export function ThemeToggle() {
  const { themeKey, setThemeKey } = useTheme();
  const { user, setUser } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newKey = e.target.value as ThemeKey;
    if (newKey === themeKey) return;

    const previousKey = themeKey;

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
        setThemeKey(previousKey);
        saveThemePreference(previousKey);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <select
      value={themeKey}
      onChange={handleChange}
      disabled={saving}
      className="w-full px-3 py-2 rounded-lg text-sm cursor-pointer"
      style={{
        background: 'var(--color-bg-elevated, var(--color-bg-surface))',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border)',
        opacity: saving ? 0.6 : 1,
      }}
    >
      {THEME_OPTIONS.map((option) => (
        <option key={option.key} value={option.key}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
