/**
 * Input Component
 *
 * Reusable input component with validation states and labels
 */

'use client';

import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'error' | 'success';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helper,
  icon,
  variant = 'default',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = [
    'block w-full rounded-lg border px-3 py-2',
    'text-gray-900 placeholder-gray-500',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400',
  ].join(' ');

  const variantClasses = {
    default: [
      'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      'dark:border-gray-600 dark:focus:border-blue-400',
    ].join(' '),
    error: [
      'border-red-300 focus:border-red-500 focus:ring-red-500',
      'dark:border-red-600 dark:focus:border-red-400',
    ].join(' '),
    success: [
      'border-green-300 focus:border-green-500 focus:ring-green-500',
      'dark:border-green-600 dark:focus:border-green-400',
    ].join(' '),
  };

  const actualVariant = error ? 'error' : variant;
  const combinedClasses = [
    baseClasses,
    variantClasses[actualVariant],
    icon ? 'pl-10' : '',
    className,
  ].join(' ');

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {icon}
            </div>
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={combinedClasses}
          {...props}
        />
      </div>

      {(error || helper) && (
        <div className="text-sm">
          {error ? (
            <p className="text-red-600 dark:text-red-400 flex items-center">
              <svg
                className="mr-1 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          ) : helper ? (
            <p className="text-gray-500 dark:text-gray-400">
              {helper}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
});