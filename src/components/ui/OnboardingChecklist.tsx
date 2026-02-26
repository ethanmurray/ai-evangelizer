'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import type { ChecklistItem } from '@/hooks/useOnboardingChecklist';

interface OnboardingChecklistProps {
  items: ChecklistItem[];
  onDismiss: () => void;
}

export function OnboardingChecklist({ items, onDismiss }: OnboardingChecklistProps) {
  const completedCount = items.filter((i) => i.completed).length;

  return (
    <Card>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
            Getting Started
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {completedCount}/{items.length} complete
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-xs px-2 py-1 rounded"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Dismiss
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-1.5 rounded-full mb-3"
        style={{ background: 'var(--color-border)' }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${(completedCount / items.length) * 100}%`,
            background: 'var(--color-success)',
          }}
        />
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center gap-2 text-sm py-1"
          >
            <span
              className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-xs"
              style={{
                borderColor: item.completed ? 'var(--color-success)' : 'var(--color-border)',
                background: item.completed ? 'var(--color-success)' : 'transparent',
                color: item.completed ? '#fff' : 'transparent',
              }}
            >
              {item.completed && '\u2713'}
            </span>
            <span
              style={{
                color: item.completed ? 'var(--color-text-muted)' : 'var(--color-text)',
                textDecoration: item.completed ? 'line-through' : 'none',
              }}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
