'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { useProgress } from '@/hooks/useProgress';
import { useUseCases } from '@/hooks/useUseCases';
import { RankDisplay } from '@/components/ui/RankDisplay';
import { Card } from '@/components/ui/Card';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { Button } from '@/components/ui/Button';
import { AboutModal } from '@/components/ui/AboutModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTheme();
  const { progress, completedCount, inProgressCount, isLoading: progressLoading } = useProgress(user?.id);
  const { useCases } = useUseCases();
  const [showAbout, setShowAbout] = useState(false);

  // Build a map of use_case_id -> progress
  const progressMap = new Map(progress.map((p) => [p.use_case_id, p]));

  // Get in-progress items (have some progress but not completed)
  const inProgressItems = useCases.filter((uc) => {
    const p = progressMap.get(uc.id);
    return p && !p.is_completed;
  });

  // Get recently completed items
  const completedItems = useCases.filter((uc) => {
    const p = progressMap.get(uc.id);
    return p?.is_completed;
  });

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold animate-flicker">
            {t.concepts.dashboard}
          </h1>
          <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Welcome back, {user?.name}
          </p>
        </div>
        <Button
          variant="outline"
          size="md"
          onClick={() => setShowAbout(true)}
          className="font-semibold about-button-pulse"
          style={{
            color: 'var(--color-primary)',
            borderColor: 'var(--color-primary)',
            borderWidth: '2px',
            backgroundColor: 'rgba(244, 162, 97, 0.1)',
          }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          {t.concepts.about}
        </Button>
      </div>

      {/* Rank Card */}
      <RankDisplay completedCount={completedCount} />

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/library">
          <Card hoverable>
            <div className="text-sm font-medium" style={{ color: 'var(--color-secondary)' }}>
              {t.concepts.library}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Browse {t.concepts.useCasePlural.toLowerCase()}
            </div>
          </Card>
        </Link>
        <Link href="/leaderboard">
          <Card hoverable>
            <div className="text-sm font-medium" style={{ color: 'var(--color-secondary)' }}>
              {t.concepts.leaderboard}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              See the rankings
            </div>
          </Card>
        </Link>
      </div>

      {/* In Progress */}
      {inProgressItems.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">
            In Progress ({inProgressCount})
          </h2>
          <div className="space-y-3">
            {inProgressItems.slice(0, 5).map((uc) => {
              const p = progressMap.get(uc.id)!;
              return (
                <Link key={uc.id} href={`/library/${uc.id}`}>
                  <Card hoverable className="mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium" style={{ color: 'var(--color-text)' }}>{uc.title}</span>
                    </div>
                    <ProgressSteps
                      seenAt={p.seen_at}
                      doneAt={p.done_at}
                      shareCount={p.share_count}
                      compact
                    />
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed */}
      {completedItems.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">
            {t.concepts.completed} ({completedCount})
          </h2>
          <div className="space-y-2">
            {completedItems.slice(0, 5).map((uc) => (
              <Link key={uc.id} href={`/library/${uc.id}`}>
                <Card hoverable className="mb-2">
                  <div className="flex items-center gap-2">
                    <span style={{ color: 'var(--color-success)' }}>&#10003;</span>
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>{uc.title}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!progressLoading && progress.length === 0 && (
        <Card>
          <p className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
            {t.microcopy.emptyDashboard}
          </p>
          <div className="text-center">
            <Link
              href="/library"
              className="inline-block px-4 py-2 rounded-lg text-sm font-medium"
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
              }}
            >
              Browse {t.concepts.library}
            </Link>
          </div>
        </Card>
      )}

      <AboutModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        title={t.microcopy.aboutTitle}
        content={t.microcopy.aboutContent}
      />
    </div>
  );
}
