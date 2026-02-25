'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { Button } from '@/components/ui/Button';

type VerifyState = 'ready' | 'verifying' | 'success' | 'expired' | 'already-used' | 'invalid' | 'error';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyAndLogin } = useAuth();
  const { t } = useTheme();

  const token = searchParams.get('token');
  const [state, setState] = useState<VerifyState>(token ? 'ready' : 'invalid');

  const handleVerify = () => {
    if (!token) return;
    setState('verifying');
    verifyAndLogin(token).then((result) => {
      if (result.success) {
        setState('success');
        setTimeout(() => router.replace('/dashboard'), 1500);
      } else {
        switch (result.error) {
          case 'EXPIRED': setState('expired'); break;
          case 'ALREADY_USED': setState('already-used'); break;
          case 'INVALID_TOKEN': setState('invalid'); break;
          default: setState('error'); break;
        }
      }
    });
  };

  const getMessage = () => {
    switch (state) {
      case 'ready': return t.microcopy.verifyReady;
      case 'verifying': return 'Verifying...';
      case 'success': return t.microcopy.verifySuccess;
      case 'expired': return t.microcopy.verifyExpired;
      case 'already-used': return t.microcopy.verifyAlreadyUsed;
      case 'invalid': return t.microcopy.verifyInvalid;
      case 'error': return 'Something went wrong. Please try again.';
    }
  };

  return (
    <div className="w-full max-w-md text-center space-y-6">
      {state === 'verifying' && (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
             style={{ borderColor: 'var(--color-primary)' }} />
      )}
      {state === 'success' && <div className="text-4xl">&#x2705;</div>}
      {(state === 'expired' || state === 'already-used' || state === 'invalid' || state === 'error') && (
        <div className="text-4xl">&#x26A0;&#xFE0F;</div>
      )}

      <p className="text-lg" style={{ color: 'var(--color-text)' }}>
        {getMessage()}
      </p>

      {state === 'ready' && (
        <Button onClick={handleVerify} className="w-full">
          Log me in
        </Button>
      )}

      {(state === 'expired' || state === 'already-used' || state === 'invalid' || state === 'error') && (
        <Button onClick={() => router.push('/login')} className="w-full">
          Back to Login
        </Button>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
      <Suspense fallback={
        <div className="animate-spin rounded-full h-8 w-8 border-b-2"
             style={{ borderColor: 'var(--color-primary)' }} />
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
