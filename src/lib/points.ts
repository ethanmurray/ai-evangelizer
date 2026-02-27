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
}

export const POINTS_CONFIG: PointsConfig = {
  learned: 1,       // Points for marking as learned (seen_at)
  applied: 3,       // Additional points for marking as applied (done_at)
  shared: 6,        // Additional points for sharing (first share)
  extraShare: 1,    // Bonus points per share beyond 2
  submitted: 5,     // Points for submitting a new use case
  teaching: 1,      // Points when someone credits you for teaching them
  viralBonus: 15,   // Bonus points when 5+ people share your submission
  viralThreshold: 5 // Number of unique sharers needed for viral bonus
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

export interface UserProgressItem {
  use_case_id: string;
  seen_at: string | null;
  done_at: string | null;
  share_count: number;
  is_completed: boolean;
}

/**
 * Calculate points for a single action
 */
export function getPointsForAction(action: 'learned' | 'applied' | 'shared' | 'submitted'): number {
  switch (action) {
    case 'learned':
      return POINTS_CONFIG.learned;
    case 'applied':
      return POINTS_CONFIG.applied;
    case 'shared':
      return POINTS_CONFIG.shared;
    case 'submitted':
      return POINTS_CONFIG.submitted;
    default:
      return 0;
  }
}

/**
 * Calculate total points for a use case based on progress
 */
export function calculateUseCasePoints(
  seenAt: string | null,
  doneAt: string | null,
  shareCount: number
): number {
  let points = 0;

  if (seenAt) {
    points += POINTS_CONFIG.learned;
  }

  if (doneAt) {
    points += POINTS_CONFIG.applied;
  }

  if (shareCount >= 1) {
    points += POINTS_CONFIG.shared;
  }

  if (shareCount > 2) {
    points += (shareCount - 2) * POINTS_CONFIG.extraShare;
  }

  return points;
}

/**
 * Calculate points breakdown from user progress
 */
export function calculatePointsBreakdown(
  progress: UserProgressItem[],
  submittedCount: number = 0,
  viralCount: number = 0
): PointsBreakdown {
  let learned = 0;
  let applied = 0;
  let shared = 0;
  let extraSharePoints = 0;

  let learnedCount = 0;
  let appliedCount = 0;
  let sharedCount = 0;

  for (const item of progress) {
    if (item.seen_at) {
      learned += POINTS_CONFIG.learned;
      learnedCount++;
    }

    if (item.done_at) {
      applied += POINTS_CONFIG.applied;
      appliedCount++;
    }

    if (item.share_count >= 1) {
      shared += POINTS_CONFIG.shared;
      sharedCount++;
    }

    if (item.share_count > 2) {
      extraSharePoints += (item.share_count - 2) * POINTS_CONFIG.extraShare;
    }
  }

  const submitted = submittedCount * POINTS_CONFIG.submitted;
  const bonuses = viralCount * POINTS_CONFIG.viralBonus + extraSharePoints;
  const total = learned + applied + shared + submitted + bonuses;

  return {
    learned,
    applied,
    shared,
    submitted,
    teaching: 0, // Populated from database
    bonuses,
    total,
    details: {
      learnedCount,
      appliedCount,
      sharedCount,
      submittedCount,
      teachingCount: 0,
      viralUseCases: [] // Will be populated from database
    }
  };
}

/**
 * Format points display with appropriate singular/plural
 */
export function formatPoints(points: number): string {
  return points === 1 ? '1 point' : `${points} points`;
}

/**
 * Get a description of how to earn points
 */
export function getPointsDescription(): string[] {
  return [
    `Learn a use case: +${POINTS_CONFIG.learned} point`,
    `Apply it: +${POINTS_CONFIG.applied} points`,
    `Share with others: +${POINTS_CONFIG.shared} points`,
    `Extra shares beyond 2: +${POINTS_CONFIG.extraShare} point each`,
    `Submit a new use case: +${POINTS_CONFIG.submitted} points`,
    `When someone credits you for teaching them: +${POINTS_CONFIG.teaching} point`,
    `When ${POINTS_CONFIG.viralThreshold}+ people share your submission: +${POINTS_CONFIG.viralBonus} bonus points`
  ];
}