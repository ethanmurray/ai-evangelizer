'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/lib/theme';
import { Button } from '@/components/ui/Button';

type Phase = 'processing' | 'done' | 'invalid' | 'error';

interface ShareState {
  currentStatus: 'confirmed' | 'denied';
  previousStatus: string;
  changed: boolean;
}

function ShareRespondContent() {
  const searchParams = useSearchParams();
  const { t } = useTheme();
  const [phase, setPhase] = useState<Phase>('processing');
  const [shareState, setShareState] = useState<ShareState | null>(null);
  const [toggling, setToggling] = useState(false);

  const token = searchParams.get('token');
  const action = searchParams.get('action');

  const sendAction = useCallback(async (actionToSend: string) => {
    const res = await fetch('/api/share/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action: actionToSend }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.error === 'invalid_token') {
        setPhase('invalid');
      } else {
        setPhase('error');
      }
      return null;
    }

    const data = await res.json();
    return data as { success: boolean; action: string; previousStatus: string; changed: boolean };
  }, [token]);

  // Initial auto-action from URL
  useEffect(() => {
    if (!token || !action || !['confirm', 'deny'].includes(action)) {
      setPhase('invalid');
      return;
    }

    sendAction(action).then((result) => {
      if (result) {
        setShareState({
          currentStatus: result.action === 'confirmed' ? 'confirmed' : 'denied',
          previousStatus: result.previousStatus,
          changed: result.changed,
        });
        setPhase('done');
      }
    });
  }, [token, action, sendAction]);

  const handleToggle = async (newAction: string) => {
    setToggling(true);
    const result = await sendAction(newAction);
    if (result) {
      setShareState({
        currentStatus: result.action === 'confirmed' ? 'confirmed' : 'denied',
        previousStatus: result.previousStatus,
        changed: result.changed,
      });
    }
    setToggling(false);
  };

  const getMessage = () => {
    if (phase === 'processing') return 'Processing...';
    if (phase === 'invalid') return t.microcopy.shareInvalidToken;
    if (phase === 'error') return 'Something went wrong. Please try again.';

    if (!shareState) return '';

    if (shareState.currentStatus === 'confirmed') return t.microcopy.shareConfirmed;
    return t.microcopy.shareDenied;
  };

  const showStatusChanged = phase === 'done' && shareState?.changed &&
    shareState.previousStatus !== 'pending';

  return (
    <div className="w-full max-w-md text-center space-y-6">
      {phase === 'processing' && (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
             style={{ borderColor: 'var(--color-primary)' }} />
      )}
      {phase === 'done' && shareState?.currentStatus === 'confirmed' && (
        <div className="text-4xl">&#x2705;</div>
      )}
      {phase === 'done' && shareState?.currentStatus === 'denied' && (
        <div className="text-4xl">&#x1F6AB;</div>
      )}
      {(phase === 'invalid' || phase === 'error') && (
        <div className="text-4xl">&#x26A0;&#xFE0F;</div>
      )}

      <p className="text-lg" style={{ color: 'var(--color-text)' }}>
        {getMessage()}
      </p>

      {showStatusChanged && (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {t.microcopy.shareStatusChanged}
        </p>
      )}

      {/* Toggle buttons: allow user to change their response */}
      {phase === 'done' && shareState && (
        <div className="space-y-3">
          {shareState.currentStatus === 'denied' && (
            <Button
              onClick={() => handleToggle('confirm')}
              disabled={toggling}
              className="w-full"
            >
              {toggling ? 'Updating...' : 'Confirm instead'}
            </Button>
          )}
          {shareState.currentStatus === 'confirmed' && (
            <Button
              onClick={() => handleToggle('deny')}
              disabled={toggling}
              className="w-full"
              variant="secondary"
            >
              {toggling ? 'Updating...' : 'Decline instead'}
            </Button>
          )}
        </div>
      )}

      {phase !== 'processing' && (
        <Button onClick={() => window.location.href = '/login'} variant="secondary" className="w-full">
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
