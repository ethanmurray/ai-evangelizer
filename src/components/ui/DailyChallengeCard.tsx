'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { DAILY_CHALLENGE_BONUS_POINTS, getNextWorkday, getWeekdayName, getUTCDateString } from '@/lib/dailyChallenge';
import type { DailyChallengeItem } from '@/lib/data/dailyChallenge';

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#22c55e',
  medium: '#f59e0b',
  hard: '#ef4444',
};

interface DailyChallengeCardProps {
  challenges: DailyChallengeItem[];
  completedType: string | null;
  streak: number;
  isWorkday: boolean;
  isLoading: boolean;
}

export function DailyChallengeCard({
  challenges,
  completedType,
  streak,
  isWorkday: isWorkdayToday,
  isLoading,
}: DailyChallengeCardProps) {
  if (isLoading) {
    return (
      <Card>
        <div className="text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
          Loading daily challenge...
        </div>
      </Card>
    );
  }

  const hasCompleted = !!completedType;

  return (
    <Card>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div
          className="text-xs uppercase tracking-wider font-semibold"
          style={{ color: 'var(--color-primary)' }}
        >
          Daily Challenge
        </div>
        {streak > 0 && (
          <div
            className="text-xs font-bold"
            style={{ color: 'var(--color-primary)' }}
          >
            {'\uD83D\uDD25'} {streak} day{streak !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Non-workday state */}
      {!isWorkdayToday && (
        <div className="text-center py-3">
          <div className="text-2xl mb-2">{'\uD83C\uDFD6\uFE0F'}</div>
          <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            Enjoy your day off!
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Challenges resume {getWeekdayName(getNextWorkday(getUTCDateString()))}.
            {streak > 0 && ' Your streak is safe!'}
          </div>
        </div>
      )}

      {/* Workday state — show challenges */}
      {isWorkdayToday && (
        <>
          {/* Completion banner */}
          {hasCompleted && (
            <div
              className="text-center text-xs font-medium py-1.5 rounded mb-3"
              style={{
                background: 'color-mix(in srgb, var(--color-success) 15%, transparent)',
                color: 'var(--color-success)',
              }}
            >
              +{DAILY_CHALLENGE_BONUS_POINTS} bonus points earned!
            </div>
          )}

          {/* Challenge rows */}
          <div className="space-y-2">
            {challenges.map((challenge) => {
              const isThisCompleted = challenge.type === completedType;

              return (
                <div
                  key={challenge.type}
                  className="flex items-center gap-3 py-1.5"
                  style={{
                    opacity: hasCompleted && !isThisCompleted ? 0.4 : 1,
                  }}
                >
                  {/* Difficulty pill */}
                  <span
                    className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0"
                    style={{
                      background: `color-mix(in srgb, ${DIFFICULTY_COLORS[challenge.difficulty]} 15%, transparent)`,
                      color: DIFFICULTY_COLORS[challenge.difficulty],
                    }}
                  >
                    {challenge.difficulty}
                  </span>

                  {/* Icon */}
                  <span className="text-lg shrink-0">{challenge.icon}</span>

                  {/* Title + description */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {challenge.title}
                    </div>
                    <div
                      className="text-xs truncate"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {challenge.description}
                    </div>
                  </div>

                  {/* Status / CTA */}
                  {isThisCompleted ? (
                    <span
                      className="text-xs font-bold shrink-0"
                      style={{ color: 'var(--color-success)' }}
                    >
                      {'\u2713'} Done
                    </span>
                  ) : !hasCompleted ? (
                    <Link
                      href="/library"
                      className="text-xs font-medium px-2 py-1 rounded shrink-0"
                      style={{
                        background: 'var(--color-primary)',
                        color: '#fff',
                      }}
                    >
                      Go
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Hint when nothing completed */}
          {!hasCompleted && (
            <div
              className="text-xs mt-3"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Complete any one for +{DAILY_CHALLENGE_BONUS_POINTS} bonus points
            </div>
          )}
        </>
      )}
    </Card>
  );
}
