'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/theme';
import { CommentType } from '@/lib/data/comments';
import { Button } from './Button';

interface CommentFormProps {
  onSubmit: (content: string, type: CommentType) => void;
  allowedTypes?: CommentType[];
  placeholder?: string;
}

export function CommentForm({
  onSubmit,
  allowedTypes = ['discussion', 'tip', 'gotcha'],
  placeholder,
}: CommentFormProps) {
  const { t } = useTheme();
  const [content, setContent] = useState('');
  const [type, setType] = useState<CommentType>(allowedTypes[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim(), type);
    setContent('');
  };

  const typeLabels: Record<string, string> = {
    discussion: t.concepts.discussion || 'Discussion',
    tip: t.concepts.tip || 'Tip',
    gotcha: t.concepts.gotcha || 'Gotcha',
    playbook_step: t.concepts.playbook || 'Step',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {allowedTypes.length > 1 && (
        <div className="flex gap-1">
          {allowedTypes.map((t) => (
            <button
              key={t}
              type="button"
              className="text-xs px-2 py-1 rounded-full border"
              style={{
                borderColor: type === t ? 'var(--color-primary)' : 'var(--color-border)',
                background: type === t ? 'var(--color-primary)' : 'transparent',
                color: type === t ? '#fff' : 'var(--color-text-muted)',
              }}
              onClick={() => setType(t)}
            >
              {typeLabels[t]}
            </button>
          ))}
        </div>
      )}
      <textarea
        className="block w-full rounded-lg border px-3 py-2 text-sm"
        style={{
          background: 'var(--color-bg-surface)',
          color: 'var(--color-text)',
          borderColor: 'var(--color-border)',
        }}
        rows={2}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder || t.microcopy.commentPlaceholder}
      />
      <Button type="submit" size="sm" disabled={!content.trim()}>
        Post
      </Button>
    </form>
  );
}
