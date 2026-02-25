'use client';

import React from 'react';

interface LabelPillProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export function LabelPill({ label, selected = false, onClick, size = 'sm' }: LabelPillProps) {
  const isInteractive = !!onClick;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={`inline-flex items-center rounded-full font-medium transition-colors ${sizeClasses} ${isInteractive ? 'cursor-pointer' : ''}`}
      style={{
        background: selected ? 'var(--color-primary)' : 'var(--color-bg-elevated, var(--color-bg-surface))',
        color: selected ? '#fff' : 'var(--color-text-muted)',
        border: `1px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
      }}
    >
      {label}
    </span>
  );
}
