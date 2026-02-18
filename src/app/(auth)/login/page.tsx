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
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold animate-flicker" style={{ color: 'var(--color-text-heading)' }}>
            {t.appName}
          </h1>
          <p className="mt-2" style={{ color: 'var(--color-text-muted)' }}>
            {t.tagline}
          </p>
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
