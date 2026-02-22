'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { useProgress } from '@/hooks/useProgress';
import { useUseCases } from '@/hooks/useUseCases';
import { RankDisplay } from '@/components/ui/RankDisplay';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { fetchUserShares, fetchUserReceivedShares, ShareRecord } from '@/lib/data/shares';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { t } = useTheme();
  const { progress, completedCount } = useProgress(user?.id);
  const { useCases } = useUseCases();
  const [shares, setShares] = useState<ShareRecord[]>([]);
  const [receivedShares, setReceivedShares] = useState<ShareRecord[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserShares(user.id).then(setShares);
      fetchUserReceivedShares(user.id).then(setReceivedShares);
    }
  }, [user]);

  const useCaseMap = new Map(useCases.map((uc) => [uc.id, uc]));
  const progressMap = new Map(progress.map((p) => [p.use_case_id, p]));

  const completed = progress.filter((p) => p.is_completed);
  const inProgress = progress.filter((p) => !p.is_completed);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold animate-flicker">
        {t.concepts.profile}
      </h1>

      {/* User info */}
      <Card>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
              {user?.name}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {user?.email}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Team: {user?.team}
            </p>
          </div>
        </div>
      </Card>

      {/* Theme preference */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold" style={{ color: 'var(--color-text-heading)' }}>
              Experience Mode
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Choose your vibe
            </p>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      {/* Rank */}
      <RankDisplay completedCount={completedCount} />

      {/* Completed use cases */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-heading)' }}>
            {t.concepts.completed} ({completed.length})
          </h2>
          <div className="space-y-2">
            {completed.map((p) => {
              const uc = useCaseMap.get(p.use_case_id);
              return (
                <Link key={p.use_case_id} href={`/library/${p.use_case_id}`}>
                  <Card hoverable className="mb-2">
                    <div className="flex items-center gap-2">
                      <span style={{ color: 'var(--color-success)' }}>&#10003;</span>
                      <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                        {uc?.title || 'Unknown'}
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* In progress */}
      {inProgress.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-heading)' }}>
            In Progress ({inProgress.length})
          </h2>
          <div className="space-y-2">
            {inProgress.map((p) => {
              const uc = useCaseMap.get(p.use_case_id);
              return (
                <Link key={p.use_case_id} href={`/library/${p.use_case_id}`}>
                  <Card hoverable className="mb-2">
                    <div className="mb-1 text-sm" style={{ color: 'var(--color-text)' }}>
                      {uc?.title || 'Unknown'}
                    </div>
                    <ProgressSteps seenAt={p.seen_at} doneAt={p.done_at} shareCount={p.share_count} compact />
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Sharing history: Taught */}
      {shares.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-heading)' }}>
            {t.concepts.step3} ({shares.length})
          </h2>
          <div className="space-y-2">
            {shares.map((s) => (
              <Card key={s.id} className="text-sm">
                <span style={{ color: 'var(--color-text)' }}>
                  Taught <span style={{ color: 'var(--color-secondary)' }}>{s.use_case_title}</span> to{' '}
                  <span style={{ color: 'var(--color-secondary)' }}>{s.recipient_name}</span>
                </span>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Sharing history: Taught by */}
      {receivedShares.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-heading)' }}>
            Taught By ({receivedShares.length})
          </h2>
          <div className="space-y-2">
            {receivedShares.map((s) => (
              <Card key={s.id} className="text-sm">
                <span style={{ color: 'var(--color-text)' }}>
                  <span style={{ color: 'var(--color-secondary)' }}>{s.sharer_name}</span> taught you{' '}
                  <span style={{ color: 'var(--color-secondary)' }}>{s.use_case_title}</span>
                </span>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="pt-4">
        <Button variant="outline" onClick={logout} className="w-full">
          Sign Out
        </Button>
      </div>
    </div>
  );
}
