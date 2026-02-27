'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/lib/theme';
import type { ThemeKey } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { saveThemePreference } from '@/lib/auth/utils/storage';
import { THEME_UNLOCK_CONFIG, isThemeUnlocked } from '@/lib/theme/themeUnlocks';
import { fetchUserPoints } from '@/lib/data/points';

export function ThemeToggle() {
  const { themeKey, setThemeKey } = useTheme();
  const { user, setUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [userPoints, setUserPoints] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch user points to determine which themes are unlocked
  useEffect(() => {
    if (user?.id) {
      fetchUserPoints(user.id).then(setUserPoints);
    }
  }, [user?.id]);

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

  const currentLabel = THEME_UNLOCK_CONFIG.find((o) => o.key === themeKey)?.label || themeKey;

  const handleSelect = async (newKey: ThemeKey) => {
    if (newKey === themeKey) {
      setOpen(false);
      return;
    }

    // Don't allow selecting locked themes
    if (!isThemeUnlocked(newKey, userPoints)) return;

    const previousKey = themeKey;
    setOpen(false);

    // Apply immediately (optimistic)
    setThemeKey(newKey);
    saveThemePreference(newKey);

    // Persist to database via API route
    if (user) {
      setSaving(true);
      try {
        const res = await fetch('/api/users/theme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, themeKey: newKey }),
        });
        if (!res.ok) throw new Error('Failed to update theme');
        const data = await res.json();
        setUser(data.user);
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
            maxHeight: 400,
            overflowY: 'auto',
          }}
        >
          {THEME_UNLOCK_CONFIG.map((option) => {
            const locked = !isThemeUnlocked(option.key, userPoints);
            const isActive = option.key === themeKey;
            const isEarned = !locked && option.requiredPoints !== null;

            return (
              <button
                key={option.key}
                onClick={() => !locked && handleSelect(option.key)}
                disabled={locked}
                className="text-sm transition-colors"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '8px 12px',
                  textAlign: 'left',
                  background: isActive ? 'var(--color-accent, #6366f1)' : 'transparent',
                  color: locked ? 'var(--color-text-muted)' : isActive ? '#fff' : 'var(--color-text)',
                  border: 'none',
                  fontWeight: isActive ? 600 : 400,
                  opacity: locked ? 0.5 : 1,
                  cursor: locked ? 'not-allowed' : 'pointer',
                }}
              >
                <span>{option.label}</span>
                {locked && (
                  <span style={{ fontSize: '0.7em', color: 'var(--color-text-muted)' }}>
                    {option.requiredPoints} pts
                  </span>
                )}
                {isEarned && !isActive && (
                  <span style={{ fontSize: '0.7em', color: 'var(--color-success)' }}>
                    Unlocked
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
