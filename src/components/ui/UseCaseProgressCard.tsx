'use client';

import React, { useState, useCallback } from 'react';
import { useTheme } from '@/lib/theme';
import { markSeen, markDone, unmarkSeen, unmarkDone, shareWithRecipient } from '@/lib/data/progress';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmailPicker } from '@/components/ui/EmailPicker';
import { Alert } from '@/components/ui/Alert';
import { ProgressSteps } from '@/components/ui/ProgressSteps';

interface UseCaseProgressCardProps {
  useCase: {
    title: string;
    seen_at: string | null;
    done_at: string | null;
    share_count: number;
    is_completed: boolean;
  };
  userId: string | undefined;
  userEmail: string | undefined;
  userName: string | undefined;
  userTeam: string | undefined;
  useCaseId: string;
  onRefresh: () => void;
}

export function UseCaseProgressCard({
  useCase,
  userId,
  userEmail,
  userName,
  userTeam,
  useCaseId,
  onRefresh,
}: UseCaseProgressCardProps) {
  const { t } = useTheme();

  const [recipient1, setRecipient1] = useState('');
  const [recipient2, setRecipient2] = useState('');
  const [sharing, setSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState('');
  const [shareError, setShareError] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showTeacherPrompt, setShowTeacherPrompt] = useState(false);
  const [teacherEmail, setTeacherEmail] = useState('');
  const [sendingAttribution, setSendingAttribution] = useState(false);

  // Show celebration when use case becomes completed
  React.useEffect(() => {
    if (useCase.is_completed && !showCelebration) {
      setShowCelebration(true);
    }
  }, [useCase.is_completed, showCelebration]);

  const handleMarkSeen = useCallback(async (attribution?: { teacherEmail: string }) => {
    if (!userId) return;
    await markSeen(userId, useCaseId);
    if (attribution?.teacherEmail) {
      fetch('/api/send-learned-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learnerId: userId,
          learnerEmail: userEmail,
          learnerName: userName || userEmail,
          teacherEmail: attribution.teacherEmail,
          useCaseTitle: useCase.title,
          useCaseId,
        }),
      }).catch((err) => console.error('Attribution email failed:', err));
    }
    setShowTeacherPrompt(false);
    setTeacherEmail('');
    onRefresh();
  }, [userId, useCaseId, userEmail, userName, useCase.title, onRefresh]);

  const handleMarkDone = useCallback(async () => {
    if (!userId) return;
    await markDone(userId, useCaseId);
    onRefresh();
  }, [userId, useCaseId, onRefresh]);

  const handleUnmarkSeen = useCallback(async () => {
    if (!userId) return;
    await unmarkSeen(userId, useCaseId);
    onRefresh();
  }, [userId, useCaseId, onRefresh]);

  const handleUnmarkDone = useCallback(async () => {
    if (!userId) return;
    await unmarkDone(userId, useCaseId);
    onRefresh();
  }, [userId, useCaseId, onRefresh]);

  const handleShare = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !recipient1.trim()) return;

    setSharing(true);
    setShareError('');
    setShareSuccess('');

    try {
      const share1 = await shareWithRecipient(userId, recipient1.trim(), useCaseId, userTeam || '');
      fetch('/api/send-share-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shareId: share1.id,
          sharerName: userName || userEmail,
          recipientEmail: recipient1.trim(),
          useCaseTitle: useCase.title,
        }),
      }).catch((err) => console.error('Share email failed:', err));

      if (recipient2.trim()) {
        const share2 = await shareWithRecipient(userId, recipient2.trim(), useCaseId, userTeam || '');
        fetch('/api/send-share-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shareId: share2.id,
            sharerName: userName || userEmail,
            recipientEmail: recipient2.trim(),
            useCaseTitle: useCase.title,
          }),
        }).catch((err) => console.error('Share email failed:', err));
      }
      setShareSuccess(t.microcopy.recruitSuccess);
      setRecipient1('');
      setRecipient2('');
      onRefresh();

      setTimeout(() => {
        onRefresh();
      }, 500);
    } catch (err: any) {
      setShareError(err.message || 'Failed to share');
    } finally {
      setSharing(false);
    }
  }, [userId, recipient1, recipient2, useCaseId, userTeam, userName, userEmail, useCase.title, t, onRefresh]);

  const canMarkSeen = !useCase.seen_at;
  const canMarkDone = useCase.seen_at && !useCase.done_at;
  const canShare = !!useCase.done_at;
  const isBonusSharing = useCase.done_at && useCase.share_count >= 2;

  return (
    <>
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
              <EmailPicker
                placeholder={t.microcopy.teacherPlaceholder}
                value={teacherEmail}
                onChange={setTeacherEmail}
                userId={userId}
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

          {/* Undo Step 1 (only when step 2 not yet done) */}
          {useCase.seen_at && !useCase.done_at && (
            <Button variant="ghost" size="sm" onClick={handleUnmarkSeen}>
              Undo {t.concepts.step1}
            </Button>
          )}

          {/* Step 2: Do */}
          {canMarkDone && (
            <Button onClick={handleMarkDone} className="w-full">
              Mark as {t.concepts.step2}
            </Button>
          )}

          {/* Undo Step 2 (only when sharing not yet started) */}
          {useCase.done_at && useCase.share_count === 0 && (
            <Button variant="ghost" size="sm" onClick={handleUnmarkDone}>
              Undo {t.concepts.step2}
            </Button>
          )}

          {/* Completed state */}
          {useCase.is_completed && (
            <div className="text-center py-2">
              <span className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>
                &#10003; {t.concepts.completed}
              </span>
            </div>
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
                {isBonusSharing ? 'Bonus: Share with more people' : `${t.concepts.step3}: Share with colleagues`}
              </h3>
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
                {isBonusSharing
                  ? `You've shared with ${useCase.share_count} people. Each additional share earns 1 bonus point!`
                  : `Enter the email(s) of people you taught this to (${useCase.share_count}/2 to complete)`}
              </p>

              {shareSuccess && (
                <Alert variant="success" className="mb-3">{shareSuccess}</Alert>
              )}
              {shareError && (
                <Alert variant="error" className="mb-3">{shareError}</Alert>
              )}

              <form onSubmit={handleShare} className="space-y-3">
                <EmailPicker
                  placeholder="colleague@company.com"
                  value={recipient1}
                  onChange={setRecipient1}
                  userId={userId}
                  required
                />
                <EmailPicker
                  placeholder="another@company.com (optional)"
                  value={recipient2}
                  onChange={setRecipient2}
                  userId={userId}
                />
                <Button type="submit" isLoading={sharing} loadingText="Sharing..." className="w-full">
                  {t.concepts.step3}
                </Button>
              </form>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
