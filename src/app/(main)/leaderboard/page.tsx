'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Card } from '@/components/ui/Card';
import { getRank } from '@/lib/rank';
import { deleteUser } from '@/lib/data/users';

type ViewMode = 'individuals' | 'teams';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { t } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('individuals');
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { entries, teams, teamRankings, isLoading, refresh } = useLeaderboard(teamFilter || undefined);

  const handleDelete = async (userId: string, name: string) => {
    if (!window.confirm(`Delete user "${name}" and all their data? This cannot be undone.`)) return;
    setDeletingId(userId);
    try {
      await deleteUser(userId);
      await refresh();
    } catch (err: any) {
      alert(`Failed to delete user: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold animate-flicker">
        {t.concepts.leaderboard}
      </h1>

      {/* View toggle + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="inline-flex rounded-lg border overflow-hidden"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <button
            className="px-4 py-2 text-sm font-medium cursor-pointer"
            style={{
              background: viewMode === 'individuals' ? 'var(--color-primary)' : 'var(--color-bg-surface)',
              color: viewMode === 'individuals' ? '#fff' : 'var(--color-text)',
            }}
            onClick={() => setViewMode('individuals')}
          >
            Individuals
          </button>
          <button
            className="px-4 py-2 text-sm font-medium cursor-pointer"
            style={{
              background: viewMode === 'teams' ? 'var(--color-primary)' : 'var(--color-bg-surface)',
              color: viewMode === 'teams' ? '#fff' : 'var(--color-text)',
            }}
            onClick={() => setViewMode('teams')}
          >
            Teams
          </button>
        </div>

        {viewMode === 'individuals' && (
          <select
            className="rounded-lg border px-3 py-2 text-sm"
            style={{
              background: 'var(--color-bg-surface)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          >
            <option value="">All Teams</option>
            {teams.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
      ) : viewMode === 'individuals' ? (
        /* Individuals table */
        entries.length === 0 ? (
          <Card>
            <p className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
              No rankings yet. Be the first to complete a {t.concepts.useCase.toLowerCase()}.
            </p>
          </Card>
        ) : (
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--color-bg-elevated)' }}>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Team</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Rank</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Points</th>
                  {user?.isAdmin && (
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}></th>
                  )}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => {
                  const isCurrentUser = entry.user_id === user?.id;
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
                        {entry.name}
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
                      {user?.isAdmin && (
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
        )
      ) : (
        /* Teams table */
        teamRankings.length === 0 ? (
          <Card>
            <p className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
              No team data yet.
            </p>
          </Card>
        ) : (
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--color-bg-elevated)' }}>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Team</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Members</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Avg Score</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Total Completed</th>
                </tr>
              </thead>
              <tbody>
                {teamRankings.map((entry, i) => {
                  const isCurrentTeam = entry.team === user?.team;

                  return (
                    <tr
                      key={entry.team}
                      className="border-t"
                      style={{
                        borderColor: 'var(--color-border)',
                        background: isCurrentTeam ? 'rgba(244, 162, 97, 0.1)' : 'var(--color-bg-surface)',
                      }}
                    >
                      <td className="px-4 py-3 text-sm font-bold" style={{ color: i < 3 ? 'var(--color-secondary)' : 'var(--color-text-muted)' }}>
                        {i + 1}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: isCurrentTeam ? 'var(--color-secondary)' : 'var(--color-text)' }}>
                        {entry.team}
                        {isCurrentTeam && <span className="ml-2 text-xs">(your team)</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-right" style={{ color: 'var(--color-text-muted)' }}>
                        {entry.memberCount}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold" style={{ color: 'var(--color-secondary)' }}>
                        {entry.avgScore}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold" style={{ color: 'var(--color-text)' }}>
                        {entry.totalCompleted}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
