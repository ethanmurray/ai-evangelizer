'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const currentLabel = THEME_OPTIONS.find((o) => o.key === themeKey)?.label || themeKey;

  const handleSelect = async (newKey: ThemeKey) => {
    if (newKey === themeKey) {
      setOpen(false);
      return;
    }

    const previousKey = themeKey;
    setOpen(false);

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
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        disabled={saving}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer"
        style={{
          background: 'var(--color-bg-elevated, var(--color-bg-surface))',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          opacity: saving ? 0.6 : 1,
          width: '100%',
        }}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>{currentLabel}</span>
        <span style={{ fontSize: '0.6em', marginLeft: 4 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            marginBottom: 4,
            background: 'var(--color-bg-elevated, var(--color-bg-surface))',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            overflow: 'hidden',
            zIndex: 50,
            boxShadow: '0 -4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.key}
              onClick={() => handleSelect(option.key)}
              className="text-sm transition-colors cursor-pointer"
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 12px',
                textAlign: 'left',
                background: option.key === themeKey ? 'var(--color-accent, #6366f1)' : 'transparent',
                color: option.key === themeKey ? '#fff' : 'var(--color-text)',
                border: 'none',
                fontWeight: option.key === themeKey ? 600 : 400,
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
