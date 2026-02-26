'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';
import { BADGE_DEFINITIONS, UserBadge } from '@/lib/data/badges';
import { Card } from './Card';

interface BadgeDisplayProps {
  earnedBadges: UserBadge[];
}

export function BadgeDisplay({ earnedBadges }: BadgeDisplayProps) {
  const { t } = useTheme();
  const earnedIds = new Set(earnedBadges.map((b) => b.badge_id));
  const badgeNames = t.badgeNames || {};

  return (
    <Card>
      <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--color-secondary)' }}>
        {t.concepts.badges}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {BADGE_DEFINITIONS.map((badge) => {
          const isEarned = earnedIds.has(badge.id);
          const name = badgeNames[badge.id]?.name || badge.id;
          const desc = badgeNames[badge.id]?.description || '';

          return (
            <div
              key={badge.id}
              className="flex flex-col items-center text-center p-2 rounded-lg border transition-opacity"
              style={{
                opacity: isEarned ? 1 : 0.3,
                borderColor: isEarned ? 'var(--color-primary)' : 'var(--color-border)',
                background: isEarned ? 'var(--color-bg-elevated)' : 'transparent',
              }}
              title={desc}
            >
              <span className="text-2xl mb-1">{badge.icon}</span>
              <span className="text-xs font-medium" style={{ color: isEarned ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                {name}
              </span>
              {isEarned && (
                <span className="text-[10px] mt-0.5" style={{ color: 'var(--color-success)' }}>
                  Earned
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
