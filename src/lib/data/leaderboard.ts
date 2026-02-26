import { supabase } from '../supabase';

export interface LeaderboardEntry {
  user_id: string;
  name: string;
  team: string;
  teams: string[];
  points: number;
  completed_count?: number; // Keep for backwards compatibility
}

export async function fetchLeaderboard(teamFilter?: string): Promise<LeaderboardEntry[]> {
  let userData: any[];

  if (teamFilter) {
    // Get user IDs in this team from user_teams junction table
    const { data: teamMembers } = await supabase
      .from('user_teams')
      .select('user_id')
      .eq('team_name', teamFilter);

    const memberIds = (teamMembers || []).map((m: any) => m.user_id);
    if (memberIds.length === 0) return [];

    const { data, error } = await supabase
      .from('user_total_points')
      .select('user_id, name, team, total_points')
      .in('user_id', memberIds)
      .order('total_points', { ascending: false });

    if (error || !data) return [];
    userData = data;
  } else {
    // No filter — return all
    const { data, error } = await supabase
      .from('user_total_points')
      .select('user_id, name, team, total_points')
      .order('total_points', { ascending: false });

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    if (!data || data.length === 0) return [];
    userData = data;
  }

  // Fetch all team associations from junction table
  const userIds = userData.map((u: any) => u.user_id);
  const { data: userTeamRows } = await supabase
    .from('user_teams')
    .select('user_id, team_name')
    .in('user_id', userIds);

  const teamsMap = new Map<string, string[]>();
  for (const row of userTeamRows || []) {
    const existing = teamsMap.get(row.user_id) || [];
    existing.push(row.team_name);
    teamsMap.set(row.user_id, existing);
  }

  return userData.map((u: any) => ({
    user_id: u.user_id,
    name: u.name,
    team: u.team,
    teams: teamsMap.get(u.user_id) || [u.team],
    points: u.total_points,
    completed_count: Math.floor(u.total_points / 10),
  }));
}

export interface TeamRankingEntry {
  team: string;
  totalCompleted: number;
  memberCount: number;
  avgScore: number;
}

export async function fetchTeamRankings(): Promise<TeamRankingEntry[]> {
  // Get all user-team associations from junction table
  const { data: userTeamRows } = await supabase
    .from('user_teams')
    .select('user_id, team_name');

  if (!userTeamRows || userTeamRows.length === 0) return [];

  // Get non-stub user IDs
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .eq('is_stub', false);

  const nonStubIds = new Set((users || []).map((u: any) => u.id));

  // Get completion counts
  const { data: counts } = await supabase
    .from('user_completed_counts')
    .select('user_id, completed_count');

  const countMap = new Map((counts || []).map((c: any) => [c.user_id, c.completed_count as number]));

  // Group by team (users in multiple teams count for each)
  const teamMap = new Map<string, { totalCompleted: number; memberCount: number }>();
  for (const row of userTeamRows) {
    if (!nonStubIds.has(row.user_id)) continue;
    const existing = teamMap.get(row.team_name) || { totalCompleted: 0, memberCount: 0 };
    existing.memberCount += 1;
    existing.totalCompleted += countMap.get(row.user_id) || 0;
    teamMap.set(row.team_name, existing);
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
