// Points system configuration and utilities

export interface PointsConfig {
  learned: number;
  applied: number;
  shared: number;
  extraShare: number;
  submitted: number;
  teaching: number;
  viralBonus: number;
  viralThreshold: number;
  dailyChallenge: number;
}

export const POINTS_CONFIG: PointsConfig = {
  learned: 1,       // Points for marking as learned (seen_at)
  applied: 3,       // Additional points for marking as applied (done_at)
  shared: 6,        // Additional points for sharing (first share)
  extraShare: 1,    // Bonus points per share beyond 2
  submitted: 5,     // Points for submitting a new use case
  teaching: 1,      // Points when someone credits you for teaching them
  viralBonus: 15,   // Bonus points when 5+ people share your submission
  viralThreshold: 5, // Number of unique sharers needed for viral bonus
  dailyChallenge: 2, // Bonus points for completing a daily challenge
};

export interface PointsBreakdown {
  learned: number;      // Points from learning use cases
  applied: number;      // Points from applying use cases
  shared: number;       // Points from sharing use cases
  submitted: number;    // Points from submitting use cases
  teaching: number;     // Points from being credited as a teacher
  bonuses: number;      // Viral bonus points
  total: number;        // Total points
  details?: {
    learnedCount: number;
    appliedCount: number;
    sharedCount: number;
    submittedCount: number;
    teachingCount: number;
    viralUseCases: string[];
  };
}

/**
 * Format points display with appropriate singular/plural
 */
export function formatPoints(points: number): string {
  return points === 1 ? '1 point' : `${points} points`;
}