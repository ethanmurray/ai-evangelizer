'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFollow } from '@/hooks/useFollow';

interface FollowButtonProps {
  useCaseId: string;
  userId: string | undefined;
}

export function FollowButton({ useCaseId, userId }: FollowButtonProps) {
  const { frequency, updateFollow, isLoading } = useFollow(useCaseId, userId);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isFollowing = frequency === 'instant' || frequency === 'daily';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  if (!userId) return null;

  const handleFollow = async () => {
    if (isFollowing) {
      setShowDropdown(!showDropdown);
    } else {
      await updateFollow('instant');
    }
  };

  const frequencyLabel = frequency === 'daily' ? 'Daily digest' : 'Instant';

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={handleFollow}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors"
        style={{
          background: isFollowing ? 'var(--color-primary)' : 'transparent',
          color: isFollowing ? '#fff' : 'var(--color-text-muted)',
          borderColor: isFollowing ? 'var(--color-primary)' : 'var(--color-border)',
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {/* Bell icon */}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {isFollowing ? (
          <>
            Following ({frequencyLabel})
            <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </>
        ) : (
          'Follow'
        )}
      </button>

      {showDropdown && (
        <div
          className="absolute z-20 mt-1 w-52 rounded-lg border shadow-lg overflow-hidden"
          style={{
            background: 'var(--color-bg-elevated)',
            borderColor: 'var(--color-border)',
          }}
        >
          <button
            type="button"
            className="block w-full text-left px-3 py-2 text-sm hover:opacity-80"
            style={{
              color: 'var(--color-text)',
              background: frequency === 'instant' ? 'var(--color-bg-surface)' : 'transparent',
            }}
            onClick={async () => {
              await updateFollow('instant');
              setShowDropdown(false);
            }}
          >
            <div className="font-medium">Instant notifications</div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Email for each new comment
            </div>
          </button>
          <button
            type="button"
            className="block w-full text-left px-3 py-2 text-sm hover:opacity-80"
            style={{
              color: 'var(--color-text)',
              background: frequency === 'daily' ? 'var(--color-bg-surface)' : 'transparent',
            }}
            onClick={async () => {
              await updateFollow('daily');
              setShowDropdown(false);
            }}
          >
            <div className="font-medium">Daily digest</div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              One email per day with all new comments
            </div>
          </button>
          <div style={{ borderTop: '1px solid var(--color-border)' }}>
            <button
              type="button"
              className="block w-full text-left px-3 py-2 text-sm hover:opacity-80"
              style={{ color: 'var(--color-error)' }}
              onClick={async () => {
                await updateFollow('off');
                setShowDropdown(false);
              }}
            >
              Unfollow
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
