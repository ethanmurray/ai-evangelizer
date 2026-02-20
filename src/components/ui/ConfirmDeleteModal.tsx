'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './Button';
import { Input } from './Input';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
  confirmTitle: string;
  confirmBody: string;
  confirmPlaceholder: string;
  confirmButtonText: string;
}

export function ConfirmDeleteModal({
  isOpen,
  title,
  onConfirm,
  onCancel,
  isDeleting,
  confirmTitle,
  confirmBody,
  confirmPlaceholder,
  confirmButtonText,
}: ConfirmDeleteModalProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isConfirmEnabled = inputValue === 'DELETE';

  useEffect(() => {
    setInputValue('');
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
        onCancel();
      }
    },
    [onCancel]
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
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-lg border p-6 space-y-4"
        style={{
          background: 'var(--color-bg-surface)',
          borderColor: 'var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
          {confirmTitle}
        </h2>

        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <strong style={{ color: 'var(--color-text)' }}>{title}</strong>
        </p>

        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {confirmBody}
        </p>

        <Input
          ref={inputRef}
          placeholder={confirmPlaceholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!isConfirmEnabled || isDeleting}
            isLoading={isDeleting}
            loadingText="Deleting..."
            onClick={onConfirm}
            style={{
              background: isConfirmEnabled ? 'var(--color-error)' : undefined,
              borderColor: isConfirmEnabled ? 'var(--color-error)' : undefined,
              color: isConfirmEnabled ? '#fff' : undefined,
            }}
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
