'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';

const difficultyColors = [
  'var(--color-success)',     // 1 - easy
  '#8bc34a',                  // 2
  'var(--color-warning)',     // 3
  '#ff9800',                  // 4
  'var(--color-error)',       // 5 - hard
];

interface DifficultyRatingProps {
  avgDifficulty: number | null;
  ratingCount: number;
  userRating: number | null;
  canRate: boolean;
  onRate?: (rating: number) => void;
  compact?: boolean;
  error?: string | null;
}

export function DifficultyRating({
  avgDifficulty,
  ratingCount,
  userRating,
  canRate,
  onRate,
  compact = false,
  error = null,
}: DifficultyRatingProps) {
  const { t } = useTheme();
  const difficultyLevels = t.concepts.difficulty === 'Danger Level'
    ? ['Trivial', 'Manageable', 'Tricky', 'Perilous', 'Suicidal']
    : ['Easy', 'Moderate', 'Intermediate', 'Challenging', 'Advanced'];

  const getLevelLabel = (value: number) => {
    const idx = Math.min(Math.max(Math.round(value) - 1, 0), 4);
    return difficultyLevels[idx];
  };

  const getColor = (value: number) => {
    const idx = Math.min(Math.max(Math.round(value) - 1, 0), 4);
    return difficultyColors[idx];
  };

  if (compact) {
    if (avgDifficulty === null || ratingCount === 0) return null;
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded"
        style={{ color: getColor(avgDifficulty), background: `${getColor(avgDifficulty)}15` }}
      >
        {getLevelLabel(avgDifficulty)}
      </span>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-bold" style={{ color: 'var(--color-secondary)' }}>
          {t.concepts.difficulty}
        </span>
        {avgDifficulty !== null && ratingCount > 0 && (
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {getLevelLabel(avgDifficulty)} ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
          </span>
        )}
        {(avgDifficulty === null || ratingCount === 0) && (
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            No ratings yet
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((level) => {
          const isAvgFilled = avgDifficulty !== null && level <= Math.round(avgDifficulty);
          const isUserRated = userRating !== null && level <= userRating;
          const color = difficultyColors[level - 1];
          const isFilled = userRating !== null ? isUserRated : isAvgFilled;

          return (
            <button
              key={level}
              className="w-5 h-5 rounded-full border-2 transition-all"
              style={{
                borderColor: color,
                background: isFilled ? color : 'transparent',
                cursor: canRate ? 'pointer' : 'default',
                opacity: canRate || isFilled ? 1 : 0.4,
              }}
              onClick={() => canRate && onRate?.(level)}
              disabled={!canRate}
              title={`${difficultyLevels[level - 1]}${canRate ? ' (click to rate)' : ''}`}
            />
          );
        })}
        {canRate && (
          <span className="text-xs ml-1" style={{ color: 'var(--color-text-muted)' }}>
            {userRating ? 'Your rating' : 'Rate this'}
          </span>
        )}
        {!canRate && (
          <span className="text-xs ml-1" style={{ color: 'var(--color-text-muted)' }}>
            Apply this use case to rate
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
