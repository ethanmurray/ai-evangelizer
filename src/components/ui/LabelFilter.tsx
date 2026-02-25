'use client';

import React from 'react';
import { LabelPill } from './LabelPill';
import { PREDEFINED_LABELS } from '@/lib/data/use-cases';

interface LabelFilterProps {
  selectedLabels: string[];
  onToggle: (label: string) => void;
  onClear: () => void;
}

export function LabelFilter({ selectedLabels, onToggle, onClear }: LabelFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {selectedLabels.length > 0 && (
        <button
          onClick={onClear}
          className="text-xs underline"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Clear filters
        </button>
      )}
      {PREDEFINED_LABELS.map((label) => (
        <LabelPill
          key={label}
          label={label}
          size="md"
          selected={selectedLabels.includes(label)}
          onClick={() => onToggle(label)}
        />
      ))}
    </div>
  );
}
