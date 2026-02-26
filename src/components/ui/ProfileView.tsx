'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme';
import { useProgress } from '@/hooks/useProgress';
import { useUseCases } from '@/hooks/useUseCases';
import { fetchUserShares, fetchUserReceivedShares, ShareRecord } from '@/lib/data/shares';
import { fetchUserPoints } from '@/lib/data/points';
import { listTeams } from '@/lib/auth/utils/database';
import { RankDisplay } from '@/components/ui/RankDisplay';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { useSkillRadar } from '@/hooks/useSkillRadar';
import { SkillRadarChart } from '@/components/ui/SkillRadarChart';
import type { User } from '@/lib/auth/types/auth';

interface ProfileViewProps {
  userId: string;
  userName: string;
  userEmail: string;
  userTeam: string;
  isOwnProfile: boolean;
  onTeamSaved?: (updatedUser: User) => void;
}

export function ProfileView({
  userId,
  userName,
  userEmail,
  userTeam,
  isOwnProfile,
  onTeamSaved,
}: ProfileViewProps) {
  const { t } = useTheme();
  const { progress, completedCount } = useProgress(userId);
  const { useCases } = useUseCases();
  const { data: skillRadarData, isLoading: radarLoading } = useSkillRadar(userId);
  const [shares, setShares] = useState<ShareRecord[]>([]);
  const [receivedShares, setReceivedShares] = useState<ShareRecord[]>([]);
  const [points, setPoints] = useState<number>(0);

  // Team editing state (own profile only)
  const [editingTeam, setEditingTeam] = useState(false);
  const [teamInput, setTeamInput] = useState('');
  const [teams, setTeams] = useState<string[]>([]);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [teamSaving, setTeamSaving] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [currentTeam, setCurrentTeam] = useState(userTeam);

  const filteredTeams = teams.filter(
    (tm) => tm.toLowerCase().includes(teamInput.toLowerCase()) && tm !== teamInput
  );

  useEffect(() => {
    fetchUserShares(userId).then(setShares);
    fetchUserReceivedShares(userId).then(setReceivedShares);
    fetchUserPoints(userId).then(setPoints);
  }, [userId]);

  useEffect(() => {
    if (editingTeam) {
      listTeams().then(setTeams);
    }
  }, [editingTeam]);

  const startEditingTeam = () => {
    setTeamInput(currentTeam);
    setTeamError(null);
    setEditingTeam(true);
  };

  const cancelEditingTeam = () => {
    setEditingTeam(false);
    setTeamError(null);
  };

  const saveTeam = async () => {
    const trimmed = teamInput.trim();
    if (!trimmed) {
      setTeamError('Team name is required');
      return;
    }
    if (trimmed === currentTeam) {
      setEditingTeam(false);
      return;
    }

    setTeamSaving(true);
    setTeamError(null);
    try {
      const { updateUserTeam } = await import('@/lib/auth/utils/database');
      const updated = await updateUserTeam(userId, trimmed);
      setCurrentTeam(updated.team);
      setEditingTeam(false);
      onTeamSaved?.(updated);
    } catch {
      setTeamError('Failed to update team');
    } finally {
      setTeamSaving(false);
    }
  };

  const useCaseMap = new Map(useCases.map((uc) => [uc.id, uc]));

  const completed = progress.filter((p) => p.is_completed);
  const inProgress = progress.filter((p) => !p.is_completed);

  return (
    <div className="space-y-6">
      {/* User info */}
      <Card>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
            }}
          >
            {userName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
              {userName}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {userEmail}
            </p>
            {isOwnProfile && editingTeam ? (
              <div className="mt-1">
                <div className="relative">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="block w-48 rounded-lg border px-2 py-1 text-sm"
                      style={{
                        background: 'var(--color-bg-surface)',
                        color: 'var(--color-text)',
                        borderColor: teamError ? 'var(--color-error)' : 'var(--color-border)',
                      }}
                      placeholder="Type or select a team"
                      value={teamInput}
                      onChange={(e) => {
                        setTeamInput(e.target.value);
                        setShowTeamDropdown(true);
                      }}
                      onFocus={() => setShowTeamDropdown(true)}
                      onBlur={() => setTimeout(() => setShowTeamDropdown(false), 200)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); saveTeam(); }
                        if (e.key === 'Escape') cancelEditingTeam();
                      }}
                      autoFocus
                    />
                    <Button size="sm" onClick={saveTeam} isLoading={teamSaving} loadingText="...">
                      {t.concepts.save}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEditingTeam}>
                      {t.concepts.cancel}
                    </Button>
                  </div>
                  {showTeamDropdown && filteredTeams.length > 0 && (
                    <div
                      className="absolute z-10 w-48 mt-1 rounded-lg border shadow-lg max-h-40 overflow-y-auto"
                      style={{
                        background: 'var(--color-bg-elevated)',
                        borderColor: 'var(--color-border)',
                      }}
                    >
                      {filteredTeams.map((team) => (
                        <button
                          key={team}
                          type="button"
                          className="block w-full text-left px-3 py-2 text-sm hover:opacity-80"
                          style={{ color: 'var(--color-text)' }}
                          onMouseDown={() => {
                            setTeamInput(team);
                            setShowTeamDropdown(false);
                          }}
                        >
                          {team}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {teamError && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{teamError}</p>
                )}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Team: {currentTeam}
                {isOwnProfile && (
                  <button
                    className="ml-2 text-xs underline cursor-pointer"
                    style={{ color: 'var(--color-secondary)' }}
                    onClick={startEditingTeam}
                  >
                    {t.concepts.edit}
                  </button>
                )}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Rank */}
      <RankDisplay points={points} />

      {/* Skill Radar */}
      <SkillRadarChart data={skillRadarData} isLoading={radarLoading} />

      {/* Completed use cases */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-heading)' }}>
            {t.concepts.completed} ({completed.length})
          </h2>
          <div className="space-y-2">
            {completed.map((p) => {
              const uc = useCaseMap.get(p.use_case_id);
              return (
                <Link key={p.use_case_id} href={`/library/${p.use_case_id}`}>
                  <Card hoverable className="mb-2">
                    <div className="flex items-center gap-2">
                      <span style={{ color: 'var(--color-success)' }}>&#10003;</span>
                      <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                        {uc?.title || 'Unknown'}
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* In progress */}
      {inProgress.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-heading)' }}>
            In Progress ({inProgress.length})
          </h2>
          <div className="space-y-2">
            {inProgress.map((p) => {
              const uc = useCaseMap.get(p.use_case_id);
              return (
                <Link key={p.use_case_id} href={`/library/${p.use_case_id}`}>
                  <Card hoverable className="mb-2">
                    <div className="mb-1 text-sm" style={{ color: 'var(--color-text)' }}>
                      {uc?.title || 'Unknown'}
                    </div>
                    <ProgressSteps seenAt={p.seen_at} doneAt={p.done_at} shareCount={p.share_count} compact />
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Sharing history: Taught */}
      {shares.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-heading)' }}>
            {t.concepts.step3} ({shares.length})
          </h2>
          <div className="space-y-2">
            {shares.map((s) => (
              <Card key={s.id} className="text-sm">
                <span style={{ color: 'var(--color-text)' }}>
                  Taught <span style={{ color: 'var(--color-secondary)' }}>{s.use_case_title}</span> to{' '}
                  <span style={{ color: 'var(--color-secondary)' }}>{s.recipient_name}</span>
                </span>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Sharing history: Taught by */}
      {receivedShares.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-heading)' }}>
            Taught By ({receivedShares.length})
          </h2>
          <div className="space-y-2">
            {receivedShares.map((s) => (
              <Card key={s.id} className="text-sm">
                <span style={{ color: 'var(--color-text)' }}>
                  <span style={{ color: 'var(--color-secondary)' }}>{s.sharer_name}</span> taught{' '}
                  {isOwnProfile ? 'you' : userName}{' '}
                  <span style={{ color: 'var(--color-secondary)' }}>{s.use_case_title}</span>
                </span>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
