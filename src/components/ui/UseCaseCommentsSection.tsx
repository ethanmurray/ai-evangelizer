'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';
import { useComments } from '@/hooks/useComments';
import { Card } from '@/components/ui/Card';
import { CommentThread } from '@/components/ui/CommentThread';
import { CommentForm } from '@/components/ui/CommentForm';
import { PlaybookSection } from '@/components/ui/PlaybookSection';

interface UseCaseCommentsSectionProps {
  useCaseId: string;
  userId: string | undefined;
  canAddPlaybookStep: boolean;
}

export function UseCaseCommentsSection({
  useCaseId,
  userId,
  canAddPlaybookStep,
}: UseCaseCommentsSectionProps) {
  const { t } = useTheme();
  const { comments, playbookSteps, addComment, editComment, removeComment } = useComments(useCaseId);

  return (
    <>
      {/* Playbook */}
      <PlaybookSection
        steps={playbookSteps}
        canAddStep={canAddPlaybookStep}
        currentUserId={userId}
        onAddStep={(content) => userId && addComment(userId, content, 'playbook_step')}
        onEditStep={editComment}
        onDeleteStep={removeComment}
      />

      {/* Discussion */}
      <Card>
        <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--color-secondary)' }}>
          {t.concepts.discussion}
        </h2>
        <CommentThread
          comments={comments}
          currentUserId={userId}
          onReply={(parentId, content) => userId && addComment(userId, content, 'discussion', parentId)}
          onDelete={removeComment}
        />
        {userId && (
          <div className="mt-3">
            <CommentForm
              onSubmit={(content, type) => addComment(userId, content, type)}
            />
          </div>
        )}
      </Card>
    </>
  );
}
