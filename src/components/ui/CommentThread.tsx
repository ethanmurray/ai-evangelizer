'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/theme';
import { Comment, CommentType } from '@/lib/data/comments';
import { Card } from './Card';

const typeIcons: Record<string, string> = {
  discussion: '\uD83D\uDCAC',
  tip: '\uD83D\uDCA1',
  gotcha: '\u26A0\uFE0F',
};

interface CommentThreadProps {
  comments: Comment[];
  currentUserId?: string;
  onReply?: (parentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
}

function CommentItem({
  comment,
  currentUserId,
  onReply,
  onDelete,
  isReply = false,
}: {
  comment: Comment;
  currentUserId?: string;
  onReply?: (parentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  isReply?: boolean;
}) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const isEdited = new Date(comment.updated_at).getTime() - new Date(comment.created_at).getTime() > 60000;
  const isOwn = currentUserId === comment.author_id;

  const handleReply = () => {
    if (!replyText.trim() || !onReply) return;
    onReply(comment.id, replyText.trim());
    setReplyText('');
    setShowReplyInput(false);
  };

  return (
    <div className={isReply ? 'ml-6 mt-2' : ''}>
      <div
        className="rounded-lg border p-3"
        style={{
          background: 'var(--color-bg-elevated)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span>{typeIcons[comment.comment_type] || '\uD83D\uDCAC'}</span>
          <span className="text-xs font-bold" style={{ color: 'var(--color-secondary)' }}>
            {comment.author_name}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
            {new Date(comment.created_at).toLocaleDateString()}
            {isEdited && ' (edited)'}
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--color-text)' }}>
          {comment.content}
        </p>
        <div className="flex gap-3 mt-2">
          {!isReply && onReply && (
            <button
              className="text-[10px]"
              style={{ color: 'var(--color-text-muted)' }}
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              Reply
            </button>
          )}
          {isOwn && onDelete && (
            <button
              className="text-[10px]"
              style={{ color: 'var(--color-error)' }}
              onClick={() => onDelete(comment.id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {showReplyInput && (
        <div className="ml-6 mt-2 flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-lg border px-2 py-1 text-sm"
            style={{
              background: 'var(--color-bg-surface)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleReply()}
          />
          <button
            className="text-xs px-2 py-1 rounded"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
            onClick={handleReply}
          >
            Send
          </button>
        </div>
      )}

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          currentUserId={currentUserId}
          onDelete={onDelete}
          isReply
        />
      ))}
    </div>
  );
}

export function CommentThread({ comments, currentUserId, onReply, onDelete }: CommentThreadProps) {
  const { t } = useTheme();

  if (comments.length === 0) {
    return (
      <p className="text-sm py-2" style={{ color: 'var(--color-text-muted)' }}>
        {t.microcopy.noComments}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onReply={onReply}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
