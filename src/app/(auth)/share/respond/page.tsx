'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/lib/theme';
import { Button } from '@/components/ui/Button';

type ResponseState = 'processing' | 'confirmed' | 'denied' | 'invalid' | 'error';

function ShareRespondContent() {
  const searchParams = useSearchParams();
  const { t } = useTheme();
  const [state, setState] = useState<ResponseState>('processing');

  const token = searchParams.get('token');
  const action = searchParams.get('action');

  useEffect(() => {
    if (!token || !action || !['confirm', 'deny'].includes(action)) {
      setState('invalid');
      return;
    }

    fetch('/api/share/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action }),
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setState(data.action === 'confirmed' ? 'confirmed' : 'denied');
        } else {
          const data = await res.json().catch(() => ({}));
          setState(data.error === 'invalid_token' ? 'invalid' : 'error');
        }
      })
      .catch(() => setState('error'));
  }, [token, action]);

  const getMessage = () => {
    switch (state) {
      case 'processing': return 'Processing...';
      case 'confirmed': return t.microcopy.shareConfirmed;
      case 'denied': return t.microcopy.shareDenied;
      case 'invalid': return t.microcopy.shareInvalidToken;
      case 'error': return 'Something went wrong. Please try again.';
    }
  };

  return (
    <div className="w-full max-w-md text-center space-y-6">
      {state === 'processing' && (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
             style={{ borderColor: 'var(--color-primary)' }} />
      )}
      {state === 'confirmed' && <div className="text-4xl">&#x2705;</div>}
      {state === 'denied' && <div className="text-4xl">&#x1F6AB;</div>}
      {(state === 'invalid' || state === 'error') && (
        <div className="text-4xl">&#x26A0;&#xFE0F;</div>
      )}

      <p className="text-lg" style={{ color: 'var(--color-text)' }}>
        {getMessage()}
      </p>

      {state !== 'processing' && (
        <Button onClick={() => window.location.href = '/login'} className="w-full">
          Go to App
        </Button>
      )}
    </div>
  );
}

export default function ShareRespondPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
      <Suspense fallback={
        <div className="animate-spin rounded-full h-8 w-8 border-b-2"
             style={{ borderColor: 'var(--color-primary)' }} />
      }>
        <ShareRespondContent />
      </Suspense>
    </div>
  );
}
