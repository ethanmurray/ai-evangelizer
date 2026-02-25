'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { Button } from '@/components/ui/Button';

type VerifyState = 'verifying' | 'success' | 'expired' | 'invalid' | 'error';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyAndLogin } = useAuth();
  const { t } = useTheme();
  const [state, setState] = useState<VerifyState>('verifying');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setState('invalid');
      return;
    }

    verifyAndLogin(token).then((result) => {
      if (result.success) {
        setState('success');
        setTimeout(() => router.replace('/dashboard'), 1500);
      } else {
        switch (result.error) {
          case 'EXPIRED': setState('expired'); break;
          case 'INVALID_TOKEN': setState('invalid'); break;
          default: setState('error'); break;
        }
      }
    });
  }, [token, verifyAndLogin, router]);

  const getMessage = () => {
    switch (state) {
      case 'verifying': return 'Verifying...';
      case 'success': return t.microcopy.verifySuccess;
      case 'expired': return t.microcopy.verifyExpired;
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
      {(state === 'expired' || state === 'invalid' || state === 'error') && (
        <div className="text-4xl">&#x26A0;&#xFE0F;</div>
      )}

      <p className="text-lg" style={{ color: 'var(--color-text)' }}>
        {getMessage()}
      </p>

      {state !== 'verifying' && state !== 'success' && (
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
