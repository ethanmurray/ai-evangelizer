'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { ProfileView } from '@/components/ui/ProfileView';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useOnboardingActions } from '@/lib/onboarding/OnboardingContext';

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const { t } = useTheme();
  const { replayOnboarding } = useOnboardingActions();

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold animate-flicker">
        {t.concepts.profile}
      </h1>

      <ProfileView
        userId={user.id}
        userName={user.name}
        userEmail={user.email}
        userTeam={user.team}
        emailOptIn={user.emailOptIn}
        isOwnProfile
        onTeamSaved={setUser}
      />

      {/* Theme preference */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold" style={{ color: 'var(--color-text-heading)' }}>
              Experience Mode
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Choose your vibe
            </p>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      {/* Replay tour */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold" style={{ color: 'var(--color-text-heading)' }}>
              {t.microcopy.replayTour}
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Review the app walkthrough
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={replayOnboarding}>
            {t.microcopy.replayTour}
          </Button>
        </div>
      </Card>

      {/* Logout */}
      <div className="pt-4">
        <Button variant="outline" onClick={logout} className="w-full">
          Sign Out
        </Button>
      </div>
    </div>
  );
}
