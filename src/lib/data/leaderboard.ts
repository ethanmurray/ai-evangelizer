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

export async function fetchTeams(): Promise<string[]> {
  const { data } = await supabase
    .from('teams')
    .select('name')
    .order('name');

  return (data || []).map((t: any) => t.name);
}
