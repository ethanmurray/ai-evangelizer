'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme';
import { useTeamDashboard } from '@/hooks/useTeamDashboard';
import { Card } from './Card';

interface TeamDashboardProps {
  teams: string[];
  defaultTeam?: string;
}

export function TeamDashboard({ teams, defaultTeam }: TeamDashboardProps) {
  const { t } = useTheme();
  const [selectedTeam, setSelectedTeam] = useState(defaultTeam || teams[0] || '');
  const { overview, members, weeklyGrowth, skillGaps, isLoading } = useTeamDashboard(selectedTeam);

  return (
    <div className="space-y-6">
      {/* Team selector */}
      <select
        className="rounded-lg border px-3 py-2 text-sm"
        style={{
          background: 'var(--color-bg-surface)',
          color: 'var(--color-text)',
          borderColor: 'var(--color-border)',
        }}
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
      >
        {teams.map((team) => (
          <option key={team} value={team}>{team}</option>
        ))}
      </select>

      {isLoading ? (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
      ) : !overview ? (
        <Card>
          <p className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
            Select a team to view the dashboard.
          </p>
        </Card>
      ) : (
        <>
          {/* Overview stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Members" value={overview.totalMembers} />
            <StatCard label="Total Points" value={overview.totalPoints} />
            <StatCard label="Learned" value={overview.totalLearned} color="var(--color-text-muted)" />
            <StatCard label="Completed" value={overview.totalCompleted} color="var(--color-success)" />
          </div>

          {/* Weekly growth chart */}
          {weeklyGrowth.length > 0 && (
            <Card>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--color-secondary)' }}>
                Weekly Growth (Last 8 Weeks)
              </h3>
              <SimpleBarChart data={weeklyGrowth} />
            </Card>
          )}

          {/* Skill gaps */}
          {skillGaps.length > 0 && (
            <Card>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--color-secondary)' }}>
                {t.concepts.skillGaps}
              </h3>
              <div className="space-y-2">
                {skillGaps.map((gap) => (
                  <div key={gap.label} className="flex items-center gap-3">
                    <span className="text-xs w-28 truncate" style={{ color: 'var(--color-text)' }}>
                      {gap.label}
                    </span>
                    <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${gap.adoptionPercent}%`,
                          background: gap.isGap ? 'var(--color-warning)' : 'var(--color-success)',
                        }}
                      />
                    </div>
                    <span
                      className="text-xs w-10 text-right font-medium"
                      style={{ color: gap.isGap ? 'var(--color-warning)' : 'var(--color-text-muted)' }}
                    >
                      {gap.adoptionPercent}%
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                Labels below 30% adoption are highlighted as skill gaps.
              </p>
            </Card>
          )}

          {/* Team members */}
          {members.length > 0 && (
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--color-bg-elevated)' }}>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Name</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Points</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--color-text-muted)' }}>Learned</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--color-text-muted)' }}>Applied</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.user_id} className="border-t" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-surface)' }}>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                        <Link href={`/profile/${member.user_id}`} className="hover:underline">
                          {member.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold" style={{ color: 'var(--color-text)' }}>{member.points}</td>
                      <td className="px-4 py-3 text-sm text-right hidden sm:table-cell" style={{ color: 'var(--color-text-muted)' }}>{member.learned_count}</td>
                      <td className="px-4 py-3 text-sm text-right hidden sm:table-cell" style={{ color: 'var(--color-text-muted)' }}>{member.applied_count}</td>
                      <td className="px-4 py-3 text-sm text-right font-bold" style={{ color: 'var(--color-success)' }}>{member.completed_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <Card>
      <div className="text-2xl font-bold" style={{ color: color || 'var(--color-primary)' }}>
        {value}
      </div>
      <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </div>
    </Card>
  );
}

function SimpleBarChart({ data }: { data: { week: string; learned: number; applied: number }[] }) {
  const maxVal = Math.max(...data.map((d) => Math.max(d.learned, d.applied)), 1);

  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((d, i) => (
        <div key={d.week} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
          <div className="w-full flex gap-0.5 items-end justify-center" style={{ height: '100%' }}>
            <div
              className="flex-1 rounded-t"
              style={{
                height: `${(d.learned / maxVal) * 100}%`,
                background: 'var(--color-text-muted)',
                minHeight: d.learned > 0 ? '4px' : '0',
                opacity: 0.5,
              }}
              title={`Learned: ${d.learned}`}
            />
            <div
              className="flex-1 rounded-t"
              style={{
                height: `${(d.applied / maxVal) * 100}%`,
                background: 'var(--color-primary)',
                minHeight: d.applied > 0 ? '4px' : '0',
              }}
              title={`Applied: ${d.applied}`}
            />
          </div>
          <span className="text-[9px] whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
            {i === 0 || i === data.length - 1
              ? new Date(d.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : ''}
          </span>
        </div>
      ))}
    </div>
  );
}
