'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { findUserById } from '@/lib/auth/utils/database';
import { ProfileView } from '@/components/ui/ProfileView';
import type { User } from '@/lib/auth/types/auth';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { t } = useTheme();
  const id = params.id as string;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // If viewing own profile, redirect to /profile
    if (currentUser && id === currentUser.id) {
      router.replace('/profile');
      return;
    }

    findUserById(id).then((found) => {
      if (found) {
        setProfileUser(found);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    });
  }, [id, currentUser, router]);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (notFound || !profileUser) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          {t.microcopy.notFound}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="text-sm flex items-center gap-1"
        style={{ color: 'var(--color-text-muted)' }}
      >
        &larr; Back
      </button>

      <h1 className="text-3xl font-bold animate-flicker">
        {profileUser.name}&apos;s {t.concepts.profile}
      </h1>

      <ProfileView
        userId={profileUser.id}
        userName={profileUser.name}
        userEmail={profileUser.email}
        userTeam={profileUser.team}
        userTeams={profileUser.teams}
        isOwnProfile={false}
      />
    </div>
  );
}
