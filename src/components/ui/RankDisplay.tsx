'use client';

import React from 'react';
import { useRank } from '@/hooks/useRank';
import { formatPoints } from '@/lib/points';

interface RankDisplayProps {
  points?: number;
  completedCount?: number; // Keep for backwards compatibility
  compact?: boolean;
}

export function RankDisplay({ points, completedCount, compact = false }: RankDisplayProps) {
  // Use points if provided, otherwise fall back to completedCount * 10 for legacy
  const totalPoints = points !== undefined ? points : (completedCount || 0) * 10;
  const { current, next } = useRank(totalPoints);

  if (compact) {
    return (
      <span className="font-bold" style={{ color: 'var(--color-secondary)' }}>
        {current.name}
      </span>
    );
  }

  return (
    <div
      className="rounded-lg border p-4"
      style={{
        background: 'var(--color-bg-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>
        Current Rank
      </div>
      <div className="text-2xl font-bold animate-flicker" style={{ color: 'var(--color-secondary)' }}>
        {current.name}
      </div>
      <div className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
        {current.desc}
      </div>
      {next && (
        <div className="mt-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {formatPoints(next.remaining)} more to reach <span style={{ color: 'var(--color-secondary)' }}>{next.rank.name}</span>
        </div>
      )}
      <div className="mt-2 text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
        {formatPoints(totalPoints)}
      </div>
    </div>
  );
}
