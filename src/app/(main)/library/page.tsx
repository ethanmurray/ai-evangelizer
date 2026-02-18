'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { useUseCases } from '@/hooks/useUseCases';
import { useProgress } from '@/hooks/useProgress';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createUseCase } from '@/lib/data/use-cases';

export default function LibraryPage() {
  const { user } = useAuth();
  const { t } = useTheme();
  const [search, setSearch] = useState('');
  const { useCases, isLoading, refresh } = useUseCases(search || undefined);
  const { progress } = useProgress(user?.id);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitTitle, setSubmitTitle] = useState('');
  const [submitDesc, setSubmitDesc] = useState('');
  const [submitResources, setSubmitResources] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const progressMap = new Map(progress.map((p) => [p.use_case_id, p]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitTitle.trim() || !submitDesc.trim() || !user) return;
    setSubmitting(true);
    try {
      await createUseCase(submitTitle, submitDesc, submitResources || null, user.id);
      setSubmitTitle('');
      setSubmitDesc('');
      setSubmitResources('');
      setShowSubmit(false);
      refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold animate-flicker">
          {t.concepts.library}
        </h1>
        <Button size="sm" onClick={() => setShowSubmit(!showSubmit)}>
          {t.concepts.submit}
        </Button>
      </div>

      {/* Submit modal */}
      {showSubmit && (
        <Card>
          <h2 className="text-lg font-bold mb-3">{t.concepts.submit}</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
            {t.microcopy.submissionPrompt}
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Title"
              value={submitTitle}
              onChange={(e) => setSubmitTitle(e.target.value)}
              placeholder={`Name this ${t.concepts.useCase.toLowerCase()}`}
              required
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                Description
              </label>
              <textarea
                className="block w-full rounded-lg border px-3 py-2 text-sm"
                style={{
                  background: 'var(--color-bg-surface)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                }}
                rows={3}
                value={submitDesc}
                onChange={(e) => setSubmitDesc(e.target.value)}
                placeholder="Describe the use case"
                required
              />
            </div>
            <Input
              label="Resources (optional)"
              value={submitResources}
              onChange={(e) => setSubmitResources(e.target.value)}
              placeholder="Links, tools, tips"
            />
            <div className="flex gap-2">
              <Button type="submit" isLoading={submitting} loadingText="Submitting...">
                Submit
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowSubmit(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder={`Search ${t.concepts.useCasePlural.toLowerCase()}...`}
      />

      {/* Use case list */}
      {isLoading ? (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          Loading...
        </div>
      ) : (
        <div className="space-y-3">
          {useCases.map((uc) => {
            const p = progressMap.get(uc.id);
            return (
              <Link key={uc.id} href={`/library/${uc.id}`}>
                <Card hoverable className="mb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>
                        {uc.title}
                      </h3>
                      <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
                        {uc.description}
                      </p>
                    </div>
                    <div className="ml-3 text-xs flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                      </svg>
                      {uc.upvote_count || 0}
                    </div>
                  </div>
                  {p && (
                    <div className="mt-2">
                      <ProgressSteps
                        seenAt={p.seen_at}
                        doneAt={p.done_at}
                        shareCount={p.share_count}
                        compact
                      />
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}

          {useCases.length === 0 && (
            <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
              No {t.concepts.useCasePlural.toLowerCase()} found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
