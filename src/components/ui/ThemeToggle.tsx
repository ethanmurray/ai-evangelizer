'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { updateUserTheme } from '@/lib/auth/utils/database';
import { saveThemePreference } from '@/lib/auth/utils/storage';

export function ThemeToggle() {
  const { themeKey, setThemeKey } = useTheme();
  const { user, setUser } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleToggle = async () => {
    const newKey = themeKey === 'cult' ? 'corporate' : 'cult';

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
      <span>{themeKey === 'cult' ? 'Conspiracy Mode' : 'Corporate Mode'}</span>
    </button>
  );
}
