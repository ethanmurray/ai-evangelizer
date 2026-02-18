'use client';

import React from 'react';
import { useRank } from '@/hooks/useRank';

interface RankDisplayProps {
  completedCount: number;
  compact?: boolean;
}

export function RankDisplay({ completedCount, compact = false }: RankDisplayProps) {
  const { current, next } = useRank(completedCount);

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
          {next.remaining} more to reach <span style={{ color: 'var(--color-secondary)' }}>{next.rank.name}</span>
        </div>
      )}
      <div className="mt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        {completedCount} completed
      </div>
    </div>
  );
}
