'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme';
import { Card } from '@/components/ui/Card';
import { getRank } from '@/lib/rank';
import { deleteUser } from '@/lib/data/users';
import type { LeaderboardEntry } from '@/lib/data/leaderboard';

interface IndividualsTableProps {
  entries: LeaderboardEntry[];
  currentUserId: string | undefined;
  isAdmin: boolean;
  onRefresh: () => void;
}

export function IndividualsTable({
  entries,
  currentUserId,
  isAdmin,
  onRefresh,
}: IndividualsTableProps) {
  const { t } = useTheme();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = useCallback(async (userId: string, name: string) => {
    if (!window.confirm(`Delete user "${name}" and all their data? This cannot be undone.`)) return;
    setDeletingId(userId);
    try {
      await deleteUser(userId);
      await onRefresh();
    } catch (err: any) {
      alert(`Failed to delete user: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  }, [onRefresh]);

  if (entries.length === 0) {
    return (
      <Card>
        <p className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          No rankings yet. Be the first to complete a {t.concepts.useCase.toLowerCase()}.
        </p>
      </Card>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
      <table className="w-full">
        <thead>
          <tr style={{ background: 'var(--color-bg-elevated)' }}>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>#</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Team</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Rank</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Points</th>
            {isAdmin && (
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}></th>
            )}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const isCurrentUser = entry.user_id === currentUserId;
            const rank = getRank(entry.points || 0, t.ranks);

            return (
              <tr
                key={entry.user_id}
                className="border-t"
                style={{
                  borderColor: 'var(--color-border)',
                  background: isCurrentUser ? 'rgba(244, 162, 97, 0.1)' : 'var(--color-bg-surface)',
                }}
              >
                <td className="px-4 py-3 text-sm font-bold" style={{ color: i < 3 ? 'var(--color-secondary)' : 'var(--color-text-muted)' }}>
                  {i + 1}
                </td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: isCurrentUser ? 'var(--color-secondary)' : 'var(--color-text)' }}>
                  <Link href={`/profile/${entry.user_id}`} className="hover:underline">
                    {entry.name}
                  </Link>
                  {isCurrentUser && <span className="ml-2 text-xs">(you)</span>}
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {entry.team}
                </td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--color-secondary)' }}>
                  {rank.name}
                </td>
                <td className="px-4 py-3 text-sm text-right font-bold" style={{ color: 'var(--color-text)' }}>
                  {entry.points || 0}
                </td>
                {isAdmin && (
                  <td className="px-4 py-3 text-sm text-right">
                    {!isCurrentUser && (
                      <button
                        onClick={() => handleDelete(entry.user_id, entry.name)}
                        disabled={deletingId === entry.user_id}
                        className="text-xs px-2 py-1 rounded cursor-pointer hover:opacity-80 disabled:opacity-50"
                        style={{ color: 'var(--color-danger, #e74c3c)', border: '1px solid var(--color-danger, #e74c3c)' }}
                      >
                        {deletingId === entry.user_id ? '...' : 'Delete'}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
