import { supabase } from '../supabase';
import type { PointsBreakdown } from '../points';

export interface UserPoints {
  user_id: string;
  activity_points: number;
  submission_points: number;
  viral_bonus_points: number;
  total_points: number;
  learned_count: number;
  applied_count: number;
  shared_count: number;
  submitted_count: number;
  viral_use_cases: string[];
}

/**
 * Fetch a user's total points
 */
export async function fetchUserPoints(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('user_total_points')
    .select('total_points')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user points:', error);
    return 0;
  }

  return data?.total_points || 0;
}

/**
 * Fetch detailed points breakdown for a user
 */
export async function fetchUserPointsBreakdown(userId: string): Promise<PointsBreakdown | null> {
  const { data, error } = await supabase
    .from('user_total_points')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching points breakdown:', error);
    return null;
  }

  if (!data) return null;

  const userPoints = data as UserPoints;

  return {
    learned: userPoints.learned_count, // Points from learned activities
    applied: userPoints.applied_count * 3, // 3 points per applied
    shared: userPoints.shared_count * 6, // 6 points per shared
    submitted: userPoints.submission_points,
    bonuses: userPoints.viral_bonus_points,
    total: userPoints.total_points,
    details: {
      learnedCount: userPoints.learned_count,
      appliedCount: userPoints.applied_count,
      sharedCount: userPoints.shared_count,
      submittedCount: userPoints.submitted_count,
      viralUseCases: userPoints.viral_use_cases || []
    }
  };
}

/**
 * Fetch leaderboard sorted by points
 */
export async function fetchLeaderboardByPoints(teamFilter?: string) {
  let query = supabase
    .from('user_total_points')
    .select('user_id, name, team, total_points')
    .order('total_points', { ascending: false });

  if (teamFilter) {
    query = query.eq('team', teamFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching points leaderboard:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch top users by points with limit
 */
export async function fetchTopUsersByPoints(limit: number = 10, teamFilter?: string) {
  let query = supabase
    .from('user_total_points')
    .select('user_id, name, team, total_points, activity_points, submission_points, viral_bonus_points')
    .order('total_points', { ascending: false })
    .limit(limit);

  if (teamFilter) {
    query = query.eq('team', teamFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching top users by points:', error);
    return [];
  }

  return data || [];
}

/**
 * Get user's rank position in leaderboard
 */
export async function fetchUserRankPosition(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('user_total_points')
    .select('user_id, total_points')
    .order('total_points', { ascending: false });

  if (error || !data) {
    console.error('Error fetching user rank position:', error);
    return 0;
  }

  const position = data.findIndex(u => u.user_id === userId);
  return position === -1 ? 0 : position + 1;
}