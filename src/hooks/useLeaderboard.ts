'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchLeaderboard, fetchTeams, fetchTeamRankings, LeaderboardEntry, TeamRankingEntry } from '@/lib/data/leaderboard';

export function useLeaderboard(teamFilter?: string) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [teamRankings, setTeamRankings] = useState<TeamRankingEntry[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [data, teamList, teamData] = await Promise.all([
        fetchLeaderboard(teamFilter),
        fetchTeams(),
        fetchTeamRankings(),
      ]);
      setEntries(data);
      setTeams(teamList);
      setTeamRankings(teamData);
    } finally {
      setIsLoading(false);
    }
  }, [teamFilter]);

  useEffect(() => { load(); }, [load]);

  return { entries, teams, teamRankings, isLoading, refresh: load };
}
