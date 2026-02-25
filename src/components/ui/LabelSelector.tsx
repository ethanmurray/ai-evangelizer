'use client';

import React from 'react';
import { LabelPill } from './LabelPill';
import { PREDEFINED_LABELS } from '@/lib/data/use-cases';

interface LabelSelectorProps {
  selectedLabels: string[];
  onChange: (labels: string[]) => void;
  disabled?: boolean;
}

export function LabelSelector({ selectedLabels, onChange, disabled }: LabelSelectorProps) {
  const toggle = (label: string) => {
    if (disabled) return;
    if (selectedLabels.includes(label)) {
      onChange(selectedLabels.filter((l) => l !== label));
    } else {
      onChange([...selectedLabels, label]);
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
        Labels
      </label>
      <div className="flex flex-wrap gap-2">
        {PREDEFINED_LABELS.map((label) => (
          <LabelPill
            key={label}
            label={label}
            size="md"
            selected={selectedLabels.includes(label)}
            onClick={() => toggle(label)}
          />
        ))}
      </div>
    </div>
  );
}
