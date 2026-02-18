import { supabase } from '../supabase';

export interface LeaderboardEntry {
  user_id: string;
  name: string;
  team: string;
  completed_count: number;
}

export async function fetchLeaderboard(teamFilter?: string): Promise<LeaderboardEntry[]> {
  // Get all completed counts
  const { data: counts } = await supabase
    .from('user_completed_counts')
    .select('user_id, completed_count')
    .order('completed_count', { ascending: false });

  if (!counts || counts.length === 0) return [];

  // Get user info for those users
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
      completed_count: countMap.get(u.id) || 0,
    }))
    .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.completed_count - a.completed_count);
}

export async function fetchTeams(): Promise<string[]> {
  const { data } = await supabase
    .from('teams')
    .select('name')
    .order('name');

  return (data || []).map((t: any) => t.name);
}
