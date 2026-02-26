'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/lib/theme';
import { useProgress } from '@/hooks/useProgress';
import { useUseCases } from '@/hooks/useUseCases';
import { fetchUserShares, fetchUserReceivedShares, ShareRecord } from '@/lib/data/shares';
import { fetchUserPoints } from '@/lib/data/points';
import { RankDisplay } from '@/components/ui/RankDisplay';
import { Timeline } from '@/components/ui/Timeline';
import { useTimeline } from '@/hooks/useTimeline';
import { useSkillRadar } from '@/hooks/useSkillRadar';
import { SkillRadarChart } from '@/components/ui/SkillRadarChart';
import { useBadges } from '@/hooks/useBadges';
import { BadgeDisplay } from '@/components/ui/BadgeDisplay';
import { ProfileHeader } from '@/components/ui/ProfileHeader';
import { ProfileProgressLists } from '@/components/ui/ProfileProgressLists';
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
  const { progress, completedCount } = useProgress(userId);
  const { events: timelineEvents, isLoading: timelineLoading } = useTimeline(userId);
  const { badges: earnedBadges } = useBadges(userId);
  const { useCases } = useUseCases();
  const { data: skillRadarData, isLoading: radarLoading } = useSkillRadar(userId);
  const [shares, setShares] = useState<ShareRecord[]>([]);
  const [receivedShares, setReceivedShares] = useState<ShareRecord[]>([]);
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    fetchUserShares(userId).then(setShares);
    fetchUserReceivedShares(userId).then(setReceivedShares);
    fetchUserPoints(userId).then(setPoints);
  }, [userId]);

  const useCaseMap = new Map(useCases.map((uc) => [uc.id, uc]));
  const completed = progress.filter((p) => p.is_completed);
  const inProgress = progress.filter((p) => !p.is_completed);

  return (
    <div className="space-y-6">
      <ProfileHeader
        userId={userId}
        userName={userName}
        userEmail={userEmail}
        userTeam={userTeam}
        isOwnProfile={isOwnProfile}
        onTeamSaved={onTeamSaved}
      />

      <RankDisplay points={points} />

      <SkillRadarChart data={skillRadarData} isLoading={radarLoading} />

      <BadgeDisplay earnedBadges={earnedBadges} />

      <ProfileProgressLists
        completed={completed}
        inProgress={inProgress}
        shares={shares}
        receivedShares={receivedShares}
        useCaseMap={useCaseMap}
        isOwnProfile={isOwnProfile}
        userName={userName}
      />

      <Timeline events={timelineEvents} isLoading={timelineLoading} />
    </div>
  );
}
