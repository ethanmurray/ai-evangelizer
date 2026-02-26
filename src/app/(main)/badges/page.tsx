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

const HOW_TO_EARN: Record<string, string> = {
  first_learn: 'Learn 1 use case',
  first_apply: 'Apply 1 use case',
  first_share: 'Share 1 use case',
  ten_learned: 'Learn 10 use cases',
  five_applied: 'Apply 5 use cases',
  taught_five: 'Teach 5 different people',
  full_stack_ai: 'Cover all 16 use case labels',
  submitted_one: 'Submit 1 use case',
  five_completed: 'Complete 5 use cases',
  speed_learner: 'Learn 3 use cases in one day',
  twenty_five_learned: 'Learn 25 use cases',
  ten_applied: 'Apply 10 use cases',
  ten_shared: 'Share 10 use cases',
  three_submitted: 'Submit 3 use cases',
  taught_ten: 'Teach 10 different people',
  ten_completed: 'Complete 10 use cases',
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
                const isUnearned = !badge.earned;
                const howToEarn = HOW_TO_EARN[badge.id] || '';
                const tooltipText = isUnearned && howToEarn
                  ? `${howToEarn} — ${badge.progressLabel}`
                  : '';

                return (
                  <div
                    key={badge.id}
                    className={isUnearned && tooltipText ? 'badge-tooltip-wrapper' : ''}
                  >
                    <Card>
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
                    {isUnearned && tooltipText && (
                      <div className="badge-tooltip">{tooltipText}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
