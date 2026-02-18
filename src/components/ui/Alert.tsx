'use client';

import React from 'react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}: AlertProps) {
  const colorMap = {
    info: 'var(--color-secondary)',
    success: 'var(--color-success)',
    warning: 'var(--color-secondary)',
    error: 'var(--color-error)',
  };

  const color = colorMap[variant];

  return (
    <div
      className={`relative rounded-lg border p-4 ${className}`}
      style={{
        borderColor: color,
        background: 'var(--color-bg-surface)',
        color: 'var(--color-text)',
      }}
      role="alert"
    >
      <div className="flex">
        <div className="flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1" style={{ color }}>{title}</h3>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-3 hover:opacity-75"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
