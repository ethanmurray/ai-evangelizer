'use client';

import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helper,
  icon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5" style={{ color: 'var(--color-text-muted)' }}>
              {icon}
            </div>
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${icon ? 'pl-10' : ''} ${className}`}
          style={{
            background: 'var(--color-bg-surface)',
            color: 'var(--color-text)',
            borderColor: error ? 'var(--color-error)' : 'var(--color-border)',
          }}
          {...props}
        />
      </div>

      {(error || helper) && (
        <div className="text-sm">
          {error ? (
            <p style={{ color: 'var(--color-error)' }}>{error}</p>
          ) : helper ? (
            <p style={{ color: 'var(--color-text-muted)' }}>{helper}</p>
          ) : null}
        </div>
      )}
    </div>
  );
});
