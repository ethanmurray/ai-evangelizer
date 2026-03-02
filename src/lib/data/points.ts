import { supabase } from '../supabase';
import type { PointsBreakdown } from '../points';

export interface UserPoints {
  user_id: string;
  activity_points: number;
  submission_points: number;
  viral_bonus_points: number;
  teaching_points: number;
  total_points: number;
  learned_count: number;
  applied_count: number;
  shared_count: number;
  submitted_count: number;
  teaching_count: number;
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
    teaching: userPoints.teaching_points || 0,
    bonuses: userPoints.viral_bonus_points,
    total: userPoints.total_points,
    details: {
      learnedCount: userPoints.learned_count,
      appliedCount: userPoints.applied_count,
      sharedCount: userPoints.shared_count,
      submittedCount: userPoints.submitted_count,
      teachingCount: userPoints.teaching_count || 0,
      viralUseCases: userPoints.viral_use_cases || []
    }
  };
}

