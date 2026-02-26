'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/lib/theme';
import { listTeams } from '@/lib/auth/utils/database';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { User } from '@/lib/auth/types/auth';

interface ProfileHeaderProps {
  userId: string;
  userName: string;
  userEmail: string;
  userTeam: string;
  isOwnProfile: boolean;
  onTeamSaved?: (updatedUser: User) => void;
}

export function ProfileHeader({
  userId,
  userName,
  userEmail,
  userTeam,
  isOwnProfile,
  onTeamSaved,
}: ProfileHeaderProps) {
  const { t } = useTheme();

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

  return (
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
  );
}
