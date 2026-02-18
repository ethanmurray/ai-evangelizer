'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchLeaderboard, fetchTeams, LeaderboardEntry } from '@/lib/data/leaderboard';

export function useLeaderboard(teamFilter?: string) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [data, teamList] = await Promise.all([
        fetchLeaderboard(teamFilter),
        fetchTeams(),
      ]);
      setEntries(data);
      setTeams(teamList);
    } finally {
      setIsLoading(false);
    }
  }, [teamFilter]);

  useEffect(() => { load(); }, [load]);

  return { entries, teams, isLoading, refresh: load };
}
