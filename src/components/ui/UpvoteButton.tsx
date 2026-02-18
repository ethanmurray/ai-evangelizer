'use client';

import React, { useState, useCallback } from 'react';
import { toggleUpvote } from '@/lib/data/upvotes';
import { useTheme } from '@/lib/theme';

interface UpvoteButtonProps {
  userId: string;
  useCaseId: string;
  initialUpvoted: boolean;
  initialCount: number;
  onToggle?: () => void;
}

export function UpvoteButton({
  userId,
  useCaseId,
  initialUpvoted,
  initialCount,
  onToggle,
}: UpvoteButtonProps) {
  const { t } = useTheme();
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = useCallback(async () => {
    setIsAnimating(true);
    const nowUpvoted = await toggleUpvote(userId, useCaseId);
    setUpvoted(nowUpvoted);
    setCount((c) => nowUpvoted ? c + 1 : c - 1);
    onToggle?.();
    setTimeout(() => setIsAnimating(false), 300);
  }, [userId, useCaseId, onToggle]);

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
        isAnimating ? 'animate-pulse-glow' : ''
      }`}
      style={{
        borderColor: upvoted ? 'var(--color-primary)' : 'var(--color-border)',
        color: upvoted ? 'var(--color-primary)' : 'var(--color-text-muted)',
        background: upvoted ? 'rgba(230, 57, 70, 0.1)' : 'transparent',
      }}
    >
      <svg className="w-4 h-4" fill={upvoted ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
      </svg>
      {count} {t.concepts.upvote}
    </button>
  );
}
