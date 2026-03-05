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
  deleteUser,
  type OrgMetrics,
  type InactiveUser,
  type RecentSignup,
} from '@/lib/data/admin';
import { fetchTeamRankings, type TeamRankingEntry } from '@/lib/data/leaderboard';
import {
  fetchUnfulfilledPrizes,
  fulfillPrize,
  type PrizeFulfillmentEntry,
} from '@/lib/data/prizes';

export default function AdminPage() {
  const { user } = useAuth();
  const { t } = useTheme();
  const router = useRouter();

  const [metrics, setMetrics] = useState<OrgMetrics | null>(null);
  const [inactive, setInactive] = useState<InactiveUser[]>([]);
  const [signups, setSignups] = useState<RecentSignup[]>([]);
  const [teamRankings, setTeamRankings] = useState<TeamRankingEntry[]>([]);
  const [prizes, setPrizes] = useState<PrizeFulfillmentEntry[]>([]);
  const [fulfillingId, setFulfillingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

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
      fetchUnfulfilledPrizes(),
    ]).then(([m, i, s, tr, p]) => {
      setMetrics(m);
      setInactive(i);
      setSignups(s);
      setTeamRankings(tr);
      setPrizes(p);
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

  async function handleFulfill(prizeId: string) {
    setFulfillingId(prizeId);
    const ok = await fulfillPrize(prizeId);
    if (ok) {
      setPrizes((prev) => prev.filter((p) => p.id !== prizeId));
    }
    setFulfillingId(null);
  }

  async function handleDeleteUser(userId: string, userName: string) {
    if (!confirm(`Are you sure you want to delete user "${userName}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    setDeletingUserId(userId);
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        // Remove the user from the inactive list
        setInactive(inactive.filter(u => u.id !== userId));
        alert(`User "${userName}" has been deleted successfully.`);
      } else {
        alert(`Failed to delete user: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    } finally {
      setDeletingUserId(null);
    }
  }

  async function handleDeleteUserSignup(userId: string, userName: string) {
    if (!confirm(`Are you sure you want to delete user "${userName}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    setDeletingUserId(userId);
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        // Remove the user from both lists (in case they appear in both)
        setSignups(signups.filter(u => u.id !== userId));
        setInactive(inactive.filter(u => u.id !== userId));
        alert(`User "${userName}" has been deleted successfully.`);
      } else {
        alert(`Failed to delete user: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    } finally {
      setDeletingUserId(null);
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

      {/* Prize Fulfillment */}
      {prizes.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">
            Prizes to Send ({prizes.length})
          </h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: 'var(--color-text-muted)' }}>
                    <th className="text-left py-2 pr-4">Name</th>
                    <th className="text-left py-2 pr-4">Email</th>
                    <th className="text-left py-2 pr-4">Level Reached</th>
                    <th className="text-left py-2 pr-4">Address</th>
                    <th className="text-left py-2 pr-4">Date</th>
                    <th className="text-right py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {prizes.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <td className="py-2 pr-4 font-medium" style={{ color: 'var(--color-text)' }}>
                        {p.userName}
                      </td>
                      <td className="py-2 pr-4" style={{ color: 'var(--color-text-muted)' }}>
                        {p.userEmail}
                      </td>
                      <td className="py-2 pr-4" style={{ color: 'var(--color-secondary)' }}>
                        {p.rankName} ({p.rankMinPoints} pts)
                      </td>
                      <td className="py-2 pr-4" style={{ color: p.shippingAddress ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                        {p.shippingAddress || 'No address yet'}
                      </td>
                      <td className="py-2 pr-4" style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 text-right">
                        <button
                          onClick={() => handleFulfill(p.id)}
                          disabled={fulfillingId === p.id}
                          className="px-3 py-1 rounded text-xs font-medium transition-colors"
                          style={{
                            background: 'var(--color-primary)',
                            color: '#fff',
                            opacity: fulfillingId === p.id ? 0.5 : 1,
                          }}
                        >
                          {fulfillingId === p.id ? 'Done!' : 'Mark Sent'}
                        </button>
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
                    <th className="text-right py-2 pr-4">Last Active</th>
                    <th className="text-center py-2">Actions</th>
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
                      <td className="py-2 pr-4 text-right" style={{ color: 'var(--color-text-muted)' }}>
                        {u.lastActivityAt
                          ? new Date(u.lastActivityAt).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="py-2 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          disabled={deletingUserId === u.id}
                          style={{
                            color: 'var(--color-error)',
                            borderColor: 'var(--color-error)',
                            opacity: deletingUserId === u.id ? 0.5 : 1,
                          }}
                        >
                          {deletingUserId === u.id ? 'Deleting...' : 'Delete'}
                        </Button>
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
                    <th className="text-right py-2 pr-4">Joined</th>
                    <th className="text-center py-2">Actions</th>
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
                      <td className="py-2 pr-4 text-right" style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUserSignup(u.id, u.name)}
                          disabled={deletingUserId === u.id}
                          style={{
                            color: 'var(--color-error)',
                            borderColor: 'var(--color-error)',
                            opacity: deletingUserId === u.id ? 0.5 : 1,
                          }}
                        >
                          {deletingUserId === u.id ? 'Deleting...' : 'Delete'}
                        </Button>
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
