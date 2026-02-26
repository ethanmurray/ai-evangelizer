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
  userTeams?: string[];
  emailOptIn: boolean;
  isOwnProfile: boolean;
  onTeamSaved?: (updatedUser: User) => void;
}

export function ProfileHeader({
  userId,
  userName,
  userEmail,
  userTeam,
  userTeams,
  emailOptIn,
  isOwnProfile,
  onTeamSaved,
}: ProfileHeaderProps) {
  const { t } = useTheme();
  const [emailOn, setEmailOn] = useState(emailOptIn);

  const [currentTeams, setCurrentTeams] = useState<string[]>(
    userTeams && userTeams.length > 0 ? userTeams : [userTeam]
  );
  const [adding, setAdding] = useState(false);
  const [addInput, setAddInput] = useState('');
  const [allTeams, setAllTeams] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredTeams = allTeams.filter(
    (tm) =>
      tm.toLowerCase().includes(addInput.toLowerCase()) &&
      !currentTeams.includes(tm)
  );

  useEffect(() => {
    if (adding) {
      listTeams().then(setAllTeams);
    }
  }, [adding]);

  const handleAddTeam = async () => {
    const trimmed = addInput.trim();
    if (!trimmed) return;
    if (currentTeams.includes(trimmed)) {
      setError('Already a member of this team');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const { addUserTeam } = await import('@/lib/auth/utils/database');
      await addUserTeam(userId, trimmed);
      const updated = [...currentTeams, trimmed];
      setCurrentTeams(updated);
      setAddInput('');
      setAdding(false);
    } catch {
      setError('Failed to add team');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveTeam = async (teamName: string) => {
    if (currentTeams.length <= 1) {
      setError('You must belong to at least one team');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const { removeUserTeam } = await import('@/lib/auth/utils/database');
      await removeUserTeam(userId, teamName);
      const updated = currentTeams.filter((tm) => tm !== teamName);
      setCurrentTeams(updated);

      // If we removed the primary team, update via callback
      if (teamName === userTeam && onTeamSaved) {
        const { findUserById } = await import('@/lib/auth/utils/database');
        const refreshed = await findUserById(userId);
        if (refreshed) onTeamSaved(refreshed);
      }
    } catch {
      setError('Failed to remove team');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
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
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {currentTeams.map((teamName) => (
              <span
                key={teamName}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: 'var(--color-bg-elevated)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {teamName}
                {isOwnProfile && currentTeams.length > 1 && (
                  <button
                    className="ml-0.5 hover:opacity-70 cursor-pointer"
                    style={{ color: 'var(--color-text-muted)' }}
                    onClick={() => handleRemoveTeam(teamName)}
                    disabled={saving}
                  >
                    &times;
                  </button>
                )}
              </span>
            ))}
            {isOwnProfile && !adding && (
              <button
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs cursor-pointer"
                style={{
                  border: '1px dashed var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
                onClick={() => setAdding(true)}
              >
                + Add Team
              </button>
            )}
          </div>
          {adding && (
            <div className="mt-1.5">
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="block w-48 rounded-lg border px-2 py-1 text-sm"
                    style={{
                      background: 'var(--color-bg-surface)',
                      color: 'var(--color-text)',
                      borderColor: error ? 'var(--color-error)' : 'var(--color-border)',
                    }}
                    placeholder="Type or select a team"
                    value={addInput}
                    onChange={(e) => {
                      setAddInput(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); handleAddTeam(); }
                      if (e.key === 'Escape') { setAdding(false); setError(null); }
                    }}
                    autoFocus
                  />
                  <Button size="sm" onClick={handleAddTeam} isLoading={saving} loadingText="...">
                    Add
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setError(null); }}>
                    {t.concepts.cancel}
                  </Button>
                </div>
                {showDropdown && filteredTeams.length > 0 && (
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
                          setAddInput(team);
                          setShowDropdown(false);
                        }}
                      >
                        {team}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {error && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{error}</p>
              )}
            </div>
          )}
          {!adding && error && (
            <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{error}</p>
          )}
          {isOwnProfile && (
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                role="switch"
                aria-checked={emailOn}
                onClick={async () => {
                  const next = !emailOn;
                  setEmailOn(next);
                  try {
                    const { updateEmailOptIn } = await import('@/lib/auth/utils/database');
                    await updateEmailOptIn(userId, next);
                  } catch {
                    setEmailOn(!next);
                  }
                }}
                className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                style={{
                  background: emailOn ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              >
                <span
                  className="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform"
                  style={{
                    transform: emailOn ? 'translateX(17px)' : 'translateX(3px)',
                  }}
                />
              </button>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Email notifications
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
