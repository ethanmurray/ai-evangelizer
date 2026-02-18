'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = false }: CardProps) {
  return (
    <div
      className={`rounded-lg border p-4 ${hoverable ? 'hover-lift cursor-pointer' : ''} ${className}`}
      style={{
        background: 'var(--color-bg-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {children}
    </div>
  );
}
