'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  fetchOrgMetrics,
  fetchInactiveUsers,
  fetchRecentSignups,
  exportUserDataCSV,
  type OrgMetrics,
  type InactiveUser,
  type RecentSignup,
} from '@/lib/data/admin';
import { fetchTeamRankings, type TeamRankingEntry } from '@/lib/data/leaderboard';

export default function AdminPage() {
  const { user } = useAuth();
  const { t } = useTheme();
  const router = useRouter();

  const [metrics, setMetrics] = useState<OrgMetrics | null>(null);
  const [inactive, setInactive] = useState<InactiveUser[]>([]);
  const [signups, setSignups] = useState<RecentSignup[]>([]);
  const [teamRankings, setTeamRankings] = useState<TeamRankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (user && !user.isAdmin) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    if (!user?.isAdmin) return;

    setIsLoading(true);
    Promise.all([
      fetchOrgMetrics(),
      fetchInactiveUsers(30),
      fetchRecentSignups(30),
      fetchTeamRankings(),
    ]).then(([m, i, s, tr]) => {
      setMetrics(m);
      setInactive(i);
      setSignups(s);
      setTeamRankings(tr);
      setIsLoading(false);
    });
  }, [user?.isAdmin]);

  async function handleExport() {
    setExporting(true);
    try {
      const csv = await exportUserDataCSV();
      if (!csv) return;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  if (!user?.isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <p style={{ color: 'var(--color-text-muted)' }}>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold animate-flicker">Admin Dashboard</h1>
        <Button
          variant="outline"
          size="md"
          onClick={handleExport}
          disabled={exporting}
          style={{
            color: 'var(--color-primary)',
            borderColor: 'var(--color-primary)',
            borderWidth: '2px',
          }}
        >
          {exporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </div>

      {/* Org Overview */}
      {metrics && (
        <div>
          <h2 className="text-lg font-bold mb-3">Org Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {metrics.totalUsers}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                Total Users
              </div>
            </Card>
            <Card>
              <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {metrics.totalPoints.toLocaleString()}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                Total Points
              </div>
            </Card>
            <Card>
              <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {metrics.totalUseCases}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {t.concepts.useCasePlural}
              </div>
            </Card>
            <Card>
              <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {metrics.activeUsersLast7Days}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                Active (7 days)
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Top Teams */}
      {teamRankings.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">Top Teams</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: 'var(--color-text-muted)' }}>
                    <th className="text-left py-2 pr-4">#</th>
                    <th className="text-left py-2 pr-4">Team</th>
                    <th className="text-right py-2 pr-4">Members</th>
                    <th className="text-right py-2 pr-4">Completed</th>
                    <th className="text-right py-2">Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {teamRankings.map((team, i) => (
                    <tr
                      key={team.team}
                      className="border-t"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <td className="py-2 pr-4" style={{ color: 'var(--color-text-muted)' }}>
                        {i + 1}
                      </td>
                      <td className="py-2 pr-4 font-medium" style={{ color: 'var(--color-text)' }}>
                        {team.team}
                      </td>
                      <td className="py-2 pr-4 text-right" style={{ color: 'var(--color-text)' }}>
                        {team.memberCount}
                      </td>
                      <td className="py-2 pr-4 text-right" style={{ color: 'var(--color-text)' }}>
                        {team.totalCompleted}
                      </td>
                      <td className="py-2 text-right font-medium" style={{ color: 'var(--color-primary)' }}>
                        {team.avgScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Inactive Users */}
      {inactive.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">
            Inactive Users ({inactive.length})
          </h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: 'var(--color-text-muted)' }}>
                    <th className="text-left py-2 pr-4">Name</th>
                    <th className="text-left py-2 pr-4">Email</th>
                    <th className="text-left py-2 pr-4">Team</th>
                    <th className="text-right py-2">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {inactive.slice(0, 20).map((u) => (
                    <tr
                      key={u.id}
                      className="border-t"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <td className="py-2 pr-4 font-medium" style={{ color: 'var(--color-text)' }}>
                        {u.name}
                      </td>
                      <td className="py-2 pr-4" style={{ color: 'var(--color-text-muted)' }}>
                        {u.email}
                      </td>
                      <td className="py-2 pr-4" style={{ color: 'var(--color-text)' }}>
                        {u.team}
                      </td>
                      <td className="py-2 text-right" style={{ color: 'var(--color-text-muted)' }}>
                        {u.lastActivityAt
                          ? new Date(u.lastActivityAt).toLocaleDateString()
                          : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Signups */}
      {signups.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">
            Recent Signups ({signups.length})
          </h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: 'var(--color-text-muted)' }}>
                    <th className="text-left py-2 pr-4">Name</th>
                    <th className="text-left py-2 pr-4">Email</th>
                    <th className="text-left py-2 pr-4">Team</th>
                    <th className="text-right py-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {signups.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <td className="py-2 pr-4 font-medium" style={{ color: 'var(--color-text)' }}>
                        {u.name}
                      </td>
                      <td className="py-2 pr-4" style={{ color: 'var(--color-text-muted)' }}>
                        {u.email}
                      </td>
                      <td className="py-2 pr-4" style={{ color: 'var(--color-text)' }}>
                        {u.team}
                      </td>
                      <td className="py-2 text-right" style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
