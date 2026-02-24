import { supabase } from '../supabase';

export interface LeaderboardEntry {
  user_id: string;
  name: string;
  team: string;
  points: number;
  completed_count?: number; // Keep for backwards compatibility
}

export async function fetchLeaderboard(teamFilter?: string): Promise<LeaderboardEntry[]> {
  // Get all user points
  let query = supabase
    .from('user_total_points')
    .select('user_id, name, team, total_points')
    .order('total_points', { ascending: false });

  if (teamFilter) {
    query = query.eq('team', teamFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  if (!data || data.length === 0) return [];

  return data.map((u: any) => ({
    user_id: u.user_id,
    name: u.name,
    team: u.team,
    points: u.total_points,
    completed_count: Math.floor(u.total_points / 10), // Approximate for backwards compatibility
  }));
}

export interface TeamRankingEntry {
  team: string;
  totalCompleted: number;
  memberCount: number;
  avgScore: number;
}

export async function fetchTeamRankings(): Promise<TeamRankingEntry[]> {
  // Get all non-stub users
  const { data: users } = await supabase
    .from('users')
    .select('id, team')
    .eq('is_stub', false);

  if (!users || users.length === 0) return [];

  // Get completion counts
  const { data: counts } = await supabase
    .from('user_completed_counts')
    .select('user_id, completed_count');

  const countMap = new Map((counts || []).map((c: any) => [c.user_id, c.completed_count as number]));

  // Group by team
  const teamMap = new Map<string, { totalCompleted: number; memberCount: number }>();
  for (const u of users) {
    const existing = teamMap.get(u.team) || { totalCompleted: 0, memberCount: 0 };
    existing.memberCount += 1;
    existing.totalCompleted += countMap.get(u.id) || 0;
    teamMap.set(u.team, existing);
  }

  return Array.from(teamMap.entries())
    .map(([team, stats]) => ({
      team,
      totalCompleted: stats.totalCompleted,
      memberCount: stats.memberCount,
      avgScore: Math.round((stats.totalCompleted / stats.memberCount) * 10) / 10,
    }))
    .sort((a, b) => b.avgScore - a.avgScore);
}

export async function fetchTeams(): Promise<string[]> {
  const { data } = await supabase
    .from('teams')
    .select('name')
    .order('name');

  return (data || []).map((t: any) => t.name);
}
