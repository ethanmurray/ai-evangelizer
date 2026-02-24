'use client';

import React, { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { useUseCase } from '@/hooks/useUseCase';
import { markSeen, markDone, shareWithRecipient } from '@/lib/data/progress';
import { deleteUseCase, updateUseCase } from '@/lib/data/use-cases';
import { hasUpvoted } from '@/lib/data/upvotes';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { UpvoteButton } from '@/components/ui/UpvoteButton';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { EditUseCaseModal } from '@/components/ui/EditUseCaseModal';

export default function UseCaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTheme();
  const id = params.id as string;
  const { useCase, isLoading, refresh } = useUseCase(id, user?.id);

  const [recipient1, setRecipient1] = useState('');
  const [recipient2, setRecipient2] = useState('');
  const [sharing, setSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState('');
  const [shareError, setShareError] = useState('');
  const [upvoted, setUpvoted] = useState<boolean | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [showTeacherPrompt, setShowTeacherPrompt] = useState(false);
  const [teacherEmail, setTeacherEmail] = useState('');
  const [sendingAttribution, setSendingAttribution] = useState(false);

  // Check if user has upvoted
  React.useEffect(() => {
    if (user && id) {
      hasUpvoted(user.id, id).then(setUpvoted);
    }
  }, [user, id]);

  const handleMarkSeen = useCallback(async (attribution?: { teacherEmail: string }) => {
    if (!user) return;
    await markSeen(user.id, id);
    if (attribution?.teacherEmail) {
      // Fire-and-forget email notification + attribution record
      fetch('/api/send-learned-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learnerId: user.id,
          learnerEmail: user.email,
          learnerName: user.name || user.email,
          teacherEmail: attribution.teacherEmail,
          useCaseTitle: useCase?.title,
          useCaseId: id,
        }),
      }).catch((err) => console.error('Attribution email failed:', err));
    }
    setShowTeacherPrompt(false);
    setTeacherEmail('');
    refresh();
  }, [user, id, useCase?.title, refresh]);

  const handleMarkDone = useCallback(async () => {
    if (!user) return;
    await markDone(user.id, id);
    refresh();
  }, [user, id, refresh]);

  const handleShare = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !recipient1.trim()) return;

    setSharing(true);
    setShareError('');
    setShareSuccess('');

    try {
      const shareId1 = await shareWithRecipient(user.id, recipient1.trim(), id, user.team);
      // Fire-and-forget email notification
      fetch('/api/send-share-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shareId: shareId1,
          sharerName: user.name || user.email,
          recipientEmail: recipient1.trim(),
          useCaseTitle: useCase?.title,
        }),
      }).catch((err) => console.error('Share email failed:', err));

      if (recipient2.trim()) {
        const shareId2 = await shareWithRecipient(user.id, recipient2.trim(), id, user.team);
        fetch('/api/send-share-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shareId: shareId2,
            sharerName: user.name || user.email,
            recipientEmail: recipient2.trim(),
            useCaseTitle: useCase?.title,
          }),
        }).catch((err) => console.error('Share email failed:', err));
      }
      setShareSuccess(t.microcopy.recruitSuccess);
      setRecipient1('');
      setRecipient2('');
      refresh();

      // Check if now completed
      setTimeout(() => {
        refresh();
      }, 500);
    } catch (err: any) {
      setShareError(err.message || 'Failed to share');
    } finally {
      setSharing(false);
    }
  }, [user, recipient1, recipient2, id, t, refresh]);

  const handleEdit = useCallback(async (updates: { title: string; description: string; resources: string }) => {
    setIsEditing(true);
    setEditError('');
    setEditSuccess('');
    try {
      await updateUseCase(id, updates);
      setEditSuccess(t.microcopy.editSuccess);
      setShowEditModal(false);
      refresh();
      setTimeout(() => setEditSuccess(''), 3000);
    } catch (err: any) {
      setEditError(err.message || t.microcopy.editError);
    } finally {
      setIsEditing(false);
    }
  }, [id, t, refresh]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteUseCase(id);
      router.push('/library');
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete');
      setIsDeleting(false);
    }
  }, [id, router]);

  // Show celebration when use case becomes completed
  React.useEffect(() => {
    if (useCase?.is_completed && !showCelebration) {
      setShowCelebration(true);
    }
  }, [useCase?.is_completed, showCelebration]);

  if (isLoading || !useCase) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          Loading...
        </div>
      </div>
    );
  }

  const canMarkSeen = !useCase.seen_at;
  const canMarkDone = useCase.seen_at && !useCase.done_at;
  const canShare = useCase.done_at && useCase.share_count < 2;

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
      </div>

      {/* Upvote + edit + delete */}
      <div className="flex items-center gap-4">
        {user && upvoted !== null && (
          <UpvoteButton
            userId={user.id}
            useCaseId={id}
            initialUpvoted={upvoted}
            initialCount={useCase.upvote_count || 0}
            onToggle={() => refresh()}
          />
        )}
        {user && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditModal(true)}
            >
              {t.concepts.edit} {t.concepts.useCase}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              style={{ color: 'var(--color-error)' }}
            >
              {t.concepts.delete} {t.concepts.useCase}
            </Button>
          </>
        )}
      </div>

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

      {/* Celebration */}
      {showCelebration && useCase.is_completed && (
        <Alert variant="success" title={t.concepts.completed}>
          {t.microcopy.completionCelebration}
        </Alert>
      )}

      {/* Progress */}
      <Card>
        <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--color-secondary)' }}>
          Your Progress
        </h2>
        <ProgressSteps
          seenAt={useCase.seen_at}
          doneAt={useCase.done_at}
          shareCount={useCase.share_count}
        />

        <div className="mt-6 space-y-4">
          {/* Step 1: See */}
          {canMarkSeen && !showTeacherPrompt && (
            <Button onClick={() => setShowTeacherPrompt(true)} className="w-full">
              Mark as {t.concepts.step1}
            </Button>
          )}

          {/* Teacher attribution prompt */}
          {canMarkSeen && showTeacherPrompt && (
            <div
              className="rounded-lg border p-4 space-y-3"
              style={{
                background: 'var(--color-bg-elevated)',
                borderColor: 'var(--color-border)',
              }}
            >
              <p className="text-sm font-medium">{t.microcopy.teacherPrompt}</p>
              <Input
                type="email"
                placeholder={t.microcopy.teacherPlaceholder}
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => handleMarkSeen()}
                >
                  {t.microcopy.teacherSkip}
                </Button>
                <Button
                  className="flex-1"
                  disabled={!teacherEmail.trim() || sendingAttribution}
                  isLoading={sendingAttribution}
                  loadingText="Sending..."
                  onClick={async () => {
                    setSendingAttribution(true);
                    await handleMarkSeen({ teacherEmail: teacherEmail.trim() });
                    setSendingAttribution(false);
                  }}
                >
                  {t.microcopy.teacherSubmit}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Do */}
          {canMarkDone && (
            <Button onClick={handleMarkDone} className="w-full">
              Mark as {t.concepts.step2}
            </Button>
          )}

          {/* Step 3: Teach */}
          {canShare && (
            <div
              className="rounded-lg border p-4"
              style={{
                background: 'var(--color-bg-elevated)',
                borderColor: 'var(--color-border)',
              }}
            >
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--color-secondary)' }}>
                {t.concepts.step3}: Share with colleagues
              </h3>
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
                Enter the email(s) of people you taught this to ({useCase.share_count}/2 shared)
              </p>

              {shareSuccess && (
                <Alert variant="success" className="mb-3">{shareSuccess}</Alert>
              )}
              {shareError && (
                <Alert variant="error" className="mb-3">{shareError}</Alert>
              )}

              <form onSubmit={handleShare} className="space-y-3">
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={recipient1}
                  onChange={(e) => setRecipient1(e.target.value)}
                  required
                />
                {useCase.share_count === 0 && (
                  <Input
                    type="email"
                    placeholder="another@company.com (optional)"
                    value={recipient2}
                    onChange={(e) => setRecipient2(e.target.value)}
                  />
                )}
                <Button type="submit" isLoading={sharing} loadingText="Sharing..." className="w-full">
                  {t.concepts.step3}
                </Button>
              </form>
            </div>
          )}

          {/* Completed state */}
          {useCase.is_completed && (
            <div className="text-center py-2">
              <span className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>
                &#10003; {t.concepts.completed}
              </span>
            </div>
          )}
        </div>
      </Card>

      {editSuccess && (
        <Alert variant="success">{editSuccess}</Alert>
      )}

      {editError && (
        <Alert variant="error">{editError}</Alert>
      )}

      {deleteError && (
        <Alert variant="error">{deleteError}</Alert>
      )}

      <EditUseCaseModal
        isOpen={showEditModal}
        useCase={useCase}
        onSave={handleEdit}
        onCancel={() => setShowEditModal(false)}
        isSaving={isEditing}
        modalTitle={t.microcopy.editTitle}
        titleLabel={t.microcopy.editTitleLabel}
        descriptionLabel={t.microcopy.editDescriptionLabel}
        resourcesLabel={t.microcopy.editResourcesLabel}
        saveButtonText={t.concepts.save}
        cancelButtonText={t.concepts.cancel}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title={useCase.title}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={isDeleting}
        confirmTitle={t.microcopy.deleteConfirmTitle}
        confirmBody={t.microcopy.deleteConfirmBody}
        confirmPlaceholder={t.microcopy.deleteConfirmPlaceholder}
        confirmButtonText={t.microcopy.deleteConfirmButton}
      />
    </div>
  );
}
