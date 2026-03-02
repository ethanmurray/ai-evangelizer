'use client';

import { useState, useEffect } from 'react';
import {
  getTeamMemberIds,
  fetchTeamOverview,
  fetchTeamMembers,
  fetchTeamWeeklyGrowth,
  fetchTeamSkillGaps,
  TeamOverview,
  TeamMember,
  WeeklyGrowth,
  SkillGap,
} from '@/lib/data/team-dashboard';

export function useTeamDashboard(team: string | undefined) {
  const [overview, setOverview] = useState<TeamOverview | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [weeklyGrowth, setWeeklyGrowth] = useState<WeeklyGrowth[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!team) return;
    setIsLoading(true);

    getTeamMemberIds(team)
      .then((memberIds) =>
        Promise.all([
          fetchTeamOverview(team, memberIds),
          fetchTeamMembers(team, memberIds),
          fetchTeamWeeklyGrowth(team, 8, memberIds),
          fetchTeamSkillGaps(team, memberIds),
        ] as const)
      )
      .then(([ov, mem, wg, sg]) => {
        setOverview(ov);
        setMembers(mem);
        setWeeklyGrowth(wg);
        setSkillGaps(sg);
      })
      .finally(() => setIsLoading(false));
  }, [team]);

  return { overview, members, weeklyGrowth, skillGaps, isLoading };
}
