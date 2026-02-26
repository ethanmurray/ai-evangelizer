'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { useUseCase } from '@/hooks/useUseCase';
import { Card } from '@/components/ui/Card';
import { LabelPill } from '@/components/ui/LabelPill';
import { usePeopleForUseCase } from '@/hooks/usePeopleForUseCase';
import { PeopleWhoKnowThis } from '@/components/ui/PeopleWhoKnowThis';
import { useDifficulty } from '@/hooks/useDifficulty';
import { DifficultyRating } from '@/components/ui/DifficultyRating';
import { useRelatedUseCases } from '@/hooks/useRelatedUseCases';
import { RelatedUseCases } from '@/components/ui/RelatedUseCases';
import { UseCaseProgressCard } from '@/components/ui/UseCaseProgressCard';
import { UseCaseActions } from '@/components/ui/UseCaseActions';
import { UseCaseCommentsSection } from '@/components/ui/UseCaseCommentsSection';

export default function UseCaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTheme();
  const id = params.id as string;
  const { useCase, isLoading, refresh } = useUseCase(id, user?.id);
  const { people, totalCount, isLoading: peopleLoading } = usePeopleForUseCase(id, user?.id);
  const { stats: difficultyStats, userRating: difficultyUserRating, rate: rateDifficultyFn, error: difficultyError } = useDifficulty(id, user?.id);
  const { related, isLoading: relatedLoading } = useRelatedUseCases(id);

  if (isLoading || !useCase) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="text-sm flex items-center gap-1"
        style={{ color: 'var(--color-text-muted)' }}
      >
        &larr; Back
      </button>

      {/* Title & description */}
      <div>
        <h1 className="text-3xl font-bold">{useCase.title}</h1>
        <p className="mt-2" style={{ color: 'var(--color-text-muted)' }}>
          {useCase.description}
        </p>
        {useCase.labels && useCase.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {useCase.labels.map((label) => (
              <LabelPill key={label} label={label} size="md" />
            ))}
          </div>
        )}
      </div>

      {/* Difficulty Rating */}
      <DifficultyRating
        avgDifficulty={difficultyStats?.avg_difficulty ?? null}
        ratingCount={difficultyStats?.rating_count ?? 0}
        userRating={difficultyUserRating}
        canRate={!!user && !!useCase.done_at}
        onRate={rateDifficultyFn}
        error={difficultyError}
      />

      <UseCaseActions
        useCase={useCase}
        userId={user?.id}
        useCaseId={id}
        onRefresh={refresh}
      />

      {/* Resources */}
      {useCase.resources && (
        <Card>
          <h2 className="text-sm font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
            Resources
          </h2>
          <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--color-text-muted)' }}>
            {useCase.resources}
          </p>
        </Card>
      )}

      <UseCaseProgressCard
        useCase={useCase}
        userId={user?.id}
        userEmail={user?.email}
        userName={user?.name}
        userTeam={user?.team}
        useCaseId={id}
        onRefresh={refresh}
      />

      {/* People who know this */}
      <PeopleWhoKnowThis
        people={people}
        totalCount={totalCount}
        isLoading={peopleLoading}
        useCaseTitle={useCase.title}
      />

      {/* Related use cases */}
      <RelatedUseCases related={related} isLoading={relatedLoading} />

      <UseCaseCommentsSection
        useCaseId={id}
        userId={user?.id}
        canAddPlaybookStep={!!user && !!useCase.done_at}
      />
    </div>
  );
}
