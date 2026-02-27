'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';

interface ProgressStepsProps {
  seenAt: string | null;
  doneAt: string | null;
  shareCount: number;
  compact?: boolean;
}

export function ProgressSteps({ seenAt, doneAt, shareCount, compact = false }: ProgressStepsProps) {
  const { t } = useTheme();

  const steps = [
    { label: t.concepts.step1, done: !!seenAt },
    { label: t.concepts.step2, done: !!doneAt },
    {
      label: shareCount >= 2
        ? `${t.concepts.step3} (${shareCount} shared)`
        : `${t.concepts.step3} (${shareCount}/2)`,
      done: shareCount >= 2,
    },
  ];

  if (compact) {
    return (
      <div className="flex gap-1">
        {steps.map((step, i) => (
          <div
            key={i}
            className="h-2 flex-1 rounded-full"
            style={{
              background: step.done ? 'var(--color-success)' : 'var(--color-border)',
            }}
            title={step.label}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: step.done ? 'var(--color-success)' : 'var(--color-border)',
              color: step.done ? '#fff' : 'var(--color-text-muted)',
            }}
          >
            {step.done ? '\u2713' : i + 1}
          </div>
          <span
            className="text-sm"
            style={{ color: step.done ? 'var(--color-success)' : 'var(--color-text-muted)' }}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
