'use client';

import React, { useState, useEffect } from 'react';
import { updateShippingAddress } from '@/lib/data/prizes';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  rankName: string;
  needsAddress: boolean;
  userId: string;
}

export function LevelUpModal({
  isOpen,
  onClose,
  rankName,
  needsAddress,
  userId,
}: LevelUpModalProps) {
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSubmitAddress() {
    if (!address.trim()) return;
    setSaving(true);
    await updateShippingAddress(userId, address.trim());
    setSaving(false);
    setSaved(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.6)' }}
      onClick={onClose}
    >
      <div
        className="max-w-md w-full rounded-lg p-6 text-center"
        style={{
          background: 'var(--color-bg-elevated)',
          border: '2px solid var(--color-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-4xl mb-3">
          {String.fromCodePoint(0x1F389)}
        </div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--color-text-heading)' }}
        >
          Level Up!
        </h2>
        <p className="text-lg mb-1" style={{ color: 'var(--color-text)' }}>
          You reached{' '}
          <span className="font-bold" style={{ color: 'var(--color-secondary)' }}>
            {rankName}
          </span>
        </p>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
          You&apos;ve earned a prize for hitting this level!
        </p>

        {needsAddress && !saved ? (
          <div className="text-left mt-4">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              Where should we send your prize?
            </label>
            <textarea
              className="w-full rounded-lg p-3 text-sm border"
              style={{
                background: 'var(--color-bg-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
              rows={3}
              placeholder="Enter your mailing address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSubmitAddress}
                disabled={!address.trim() || saving}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                style={{
                  background: 'var(--color-primary)',
                  color: '#fff',
                }}
              >
                {saving ? 'Saving...' : 'Save & Claim Prize'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: 'var(--color-bg-surface)',
                  color: 'var(--color-text-muted)',
                  border: '1px solid var(--color-border)',
                }}
              >
                Later
              </button>
            </div>
          </div>
        ) : saved ? (
          <div className="mt-4">
            <p className="text-sm mb-3" style={{ color: 'var(--color-success, var(--color-primary))' }}>
              Address saved! Your prize is on its way.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
              }}
            >
              Awesome!
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>
              Your prize will be sent to your address on file.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
              }}
            >
              Awesome!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
