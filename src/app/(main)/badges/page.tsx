'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { useBadgeProgress } from '@/hooks/useBadgeProgress';
import { Card } from '@/components/ui/Card';

const CATEGORY_ORDER = ['learning', 'applying', 'sharing', 'special'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  learning: 'Learning',
  applying: 'Applying',
  sharing: 'Sharing & Teaching',
  special: 'Special',
};

export default function BadgesPage() {
  const { user } = useAuth();
  const { t } = useTheme();
  const { badges, isLoading } = useBadgeProgress(user?.id);

  const earnedCount = badges.filter((b) => b.earned).length;

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    badges: badges.filter((b) => b.category === cat),
  }));

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold animate-flicker">{t.concepts.badges}</h1>
        {!isLoading && (
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {earnedCount} of {badges.length} earned
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          Loading...
        </div>
      ) : (
        grouped.map((group) => (
          <div key={group.category}>
            <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-heading)' }}>
              {group.label}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {group.badges.map((badge) => {
                const badgeName = t.badgeNames[badge.id];
                return (
                  <Card key={badge.id}>
                    <div
                      className="text-center space-y-2"
                      style={{ opacity: badge.earned ? 1 : 0.4 }}
                    >
                      <div className="text-3xl">{badge.icon}</div>
                      <div
                        className="text-sm font-bold"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {badgeName?.name || badge.id}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {badgeName?.description || ''}
                      </div>
                      {badge.earned ? (
                        <div
                          className="text-xs font-medium"
                          style={{ color: 'var(--color-success)' }}
                        >
                          Earned {new Date(badge.earnedAt!).toLocaleDateString()}
                        </div>
                      ) : (
                        <div>
                          <div
                            className="w-full rounded-full h-1.5 mt-1"
                            style={{ background: 'var(--color-border)' }}
                          >
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${Math.round(badge.progress * 100)}%`,
                                background: 'var(--color-primary)',
                              }}
                            />
                          </div>
                          <div
                            className="text-xs mt-0.5"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            {badge.progressLabel}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
