'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';
import { Button } from '@/components/ui/Button';

interface EmailConsentModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function EmailConsentModal({ onAccept, onDecline }: EmailConsentModalProps) {
  const { t } = useTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-md rounded-xl p-6 shadow-2xl"
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
        }}
      >
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: 'var(--color-text-heading)' }}
        >
          {t.microcopy.emailConsentTitle}
        </h2>
        <p
          className="text-sm mb-4 leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {t.microcopy.emailConsentBody}
        </p>
        <ul
          className="text-sm mb-5 space-y-1"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <li>&#8226; {t.microcopy.emailConsentBullet1}</li>
          <li>&#8226; {t.microcopy.emailConsentBullet2}</li>
          <li>&#8226; {t.microcopy.emailConsentBullet3}</li>
        </ul>
        <div className="flex gap-3">
          <Button onClick={onAccept} className="flex-1">
            {t.microcopy.emailConsentAccept}
          </Button>
          <Button variant="ghost" onClick={onDecline} className="flex-1">
            {t.microcopy.emailConsentDecline}
          </Button>
        </div>
      </div>
    </div>
  );
}
