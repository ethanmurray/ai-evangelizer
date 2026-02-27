'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { AuthForm } from '@/components/auth';

export default function LoginPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const { t } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isInitializing) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isInitializing, router]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold animate-flicker" style={{ color: 'var(--color-text-heading)' }}>
            {t.appName}
          </h1>
          <p className="mt-2" style={{ color: 'var(--color-text-muted)' }}>
            {t.tagline}
          </p>
          <p className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)', opacity: 0.85 }}>
            {t.microcopy.loginExplainer}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-center">
          {[
            { num: '1', title: t.microcopy.loginStep1Title, desc: t.microcopy.loginStep1Desc },
            { num: '2', title: t.microcopy.loginStep2Title, desc: t.microcopy.loginStep2Desc },
            { num: '3', title: t.microcopy.loginStep3Title, desc: t.microcopy.loginStep3Desc },
          ].map((step) => (
            <div
              key={step.num}
              className="p-3 rounded-lg"
              style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
            >
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold"
                style={{ background: 'var(--color-primary)', color: 'var(--color-bg)' }}
              >
                {step.num}
              </div>
              <h3 className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text-heading)' }}>
                {step.title}
              </h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          className="rounded-lg border p-6"
          style={{
            background: 'var(--color-bg-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <AuthForm onSuccess={() => router.replace('/dashboard')} />
        </div>
      </div>
    </div>
  );
}
