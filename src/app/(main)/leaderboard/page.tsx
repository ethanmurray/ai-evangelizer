'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { TeamDashboard } from '@/components/ui/TeamDashboard';
import { HeatmapGrid } from '@/components/ui/HeatmapGrid';
import { IndividualsTable } from '@/components/ui/IndividualsTable';
import { TeamsTable } from '@/components/ui/TeamsTable';

type ViewMode = 'individuals' | 'teams' | 'team-dashboard' | 'heatmap';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { t } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('individuals');
  const [teamFilter, setTeamFilter] = useState<string>('');
  const { entries, teams, teamRankings, isLoading, refresh } = useLeaderboard(teamFilter || undefined);

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
          {(['individuals', 'teams', 'team-dashboard', 'heatmap'] as const).map((mode) => {
            const labels: Record<ViewMode, string> = {
              individuals: 'Individuals',
              teams: 'Teams',
              'team-dashboard': t.concepts.teamDashboard,
              heatmap: t.concepts.heatmap,
            };
            return (
              <button
                key={mode}
                className="px-4 py-2 text-sm font-medium cursor-pointer"
                style={{
                  background: viewMode === mode ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                  color: viewMode === mode ? '#fff' : 'var(--color-text)',
                }}
                onClick={() => setViewMode(mode)}
              >
                {labels[mode]}
              </button>
            );
          })}
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
      {viewMode === 'team-dashboard' ? (
        <TeamDashboard teams={teams} defaultTeam={user?.team} />
      ) : viewMode === 'heatmap' ? (
        <HeatmapGrid />
      ) : isLoading ? (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
      ) : viewMode === 'individuals' ? (
        <IndividualsTable
          entries={entries}
          currentUserId={user?.id}
          isAdmin={!!user?.isAdmin}
          onRefresh={refresh}
        />
      ) : (
        <TeamsTable
          teamRankings={teamRankings}
          currentUserTeam={user?.team}
        />
      )}
    </div>
  );
}
