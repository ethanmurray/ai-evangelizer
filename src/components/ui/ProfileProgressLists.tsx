'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme';
import { Card } from '@/components/ui/Card';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import type { ShareRecord } from '@/lib/data/shares';

interface ProgressItem {
  use_case_id: string;
  seen_at: string | null;
  done_at: string | null;
  share_count: number;
  is_completed: boolean;
}

interface ProfileProgressListsProps {
  completed: ProgressItem[];
  inProgress: ProgressItem[];
  shares: ShareRecord[];
  receivedShares: ShareRecord[];
  useCaseMap: Map<string, { title: string }>;
  isOwnProfile: boolean;
  userName: string;
}

export function ProfileProgressLists({
  completed,
  inProgress,
  shares,
  receivedShares,
  useCaseMap,
  isOwnProfile,
  userName,
}: ProfileProgressListsProps) {
  const { t } = useTheme();

  return (
    <>
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
                  <span style={{ color: 'var(--color-secondary)' }}>{s.sharer_name}</span> taught{' '}
                  {isOwnProfile ? 'you' : userName}{' '}
                  <span style={{ color: 'var(--color-secondary)' }}>{s.use_case_title}</span>
                </span>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
