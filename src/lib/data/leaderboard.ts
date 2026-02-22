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
    // Fallback to old method if view doesn't exist yet
    return fetchLeaderboardLegacy(teamFilter);
  }

  if (!data || data.length === 0) return [];

  return data.map((u: any) => ({
    user_id: u.user_id,
    name: u.name,
    team: u.team,
    points: u.total_points,
    completed_count: 0, // No longer used, kept for compatibility
  }));
}

// Legacy fallback for before migration is run
async function fetchLeaderboardLegacy(teamFilter?: string): Promise<LeaderboardEntry[]> {
  const { data: counts } = await supabase
    .from('user_completed_counts')
    .select('user_id, completed_count')
    .order('completed_count', { ascending: false });

  if (!counts || counts.length === 0) return [];

  const userIds = counts.map((c: any) => c.user_id);
  let userQuery = supabase
    .from('users')
    .select('id, name, team')
    .in('id', userIds)
    .eq('is_stub', false);

  if (teamFilter) {
    userQuery = userQuery.eq('team', teamFilter);
  }

  const { data: users } = await userQuery;
  if (!users) return [];

  const userMap = new Map(users.map((u: any) => [u.id, u]));
  const countMap = new Map(counts.map((c: any) => [c.user_id, c.completed_count]));

  return users
    .map((u: any) => ({
      user_id: u.id,
      name: u.name,
      team: u.team,
      points: (countMap.get(u.id) || 0) * 10, // Approximate points from completion count
      completed_count: countMap.get(u.id) || 0,
    }))
    .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.points - a.points);
}

export async function fetchTeams(): Promise<string[]> {
  const { data } = await supabase
    .from('teams')
    .select('name')
    .order('name');

  return (data || []).map((t: any) => t.name);
}
