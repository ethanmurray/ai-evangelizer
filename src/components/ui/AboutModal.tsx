'use client';

import React, { useEffect, useCallback } from 'react';
import { Button } from './Button';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function AboutModal({ isOpen, onClose, title, content }: AboutModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg border p-6 space-y-4"
        style={{
          background: 'var(--color-bg-surface)',
          borderColor: 'var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          {title}
        </h2>

        <div
          className="prose prose-sm space-y-4"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>

        <div
          className="text-xs pt-2"
          style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}
        >
          v{process.env.NEXT_PUBLIC_APP_VERSION}
          {process.env.NEXT_PUBLIC_BUILD_DATE &&
            ` · Built ${new Date(process.env.NEXT_PUBLIC_BUILD_DATE).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          {process.env.NEXT_PUBLIC_BUILD_COMMIT &&
            ` · ${process.env.NEXT_PUBLIC_BUILD_COMMIT}`}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}