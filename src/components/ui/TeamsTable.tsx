'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import type { TeamRankingEntry } from '@/lib/data/leaderboard';

interface TeamsTableProps {
  teamRankings: TeamRankingEntry[];
  currentUserTeam: string | undefined;
}

export function TeamsTable({ teamRankings, currentUserTeam }: TeamsTableProps) {
  if (teamRankings.length === 0) {
    return (
      <Card>
        <p className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          No team data yet.
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
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Team</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Members</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Avg Score</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Total Completed</th>
          </tr>
        </thead>
        <tbody>
          {teamRankings.map((entry, i) => {
            const isCurrentTeam = entry.team === currentUserTeam;

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
  );
}
