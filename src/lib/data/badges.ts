import { supabase } from '../supabase';
import { PREDEFINED_LABELS } from './use-cases';
import { createNotification } from './notifications';

export interface BadgeDefinition {
  id: string;
  icon: string;
  category: 'learning' | 'applying' | 'sharing' | 'special';
  check: (stats: UserBadgeStats) => boolean;
}

export interface UserBadgeStats {
  learnedCount: number;
  appliedCount: number;
  completedCount: number;
  sharedCount: number;
  submittedCount: number;
  distinctPeopleTaught: number;
  labelsCovered: string[];
  learnedToday: number;
  dailyChallengeStreak: number;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first_learn',
    icon: '\uD83D\uDC41\uFE0F',
    category: 'learning',
    check: (s) => s.learnedCount >= 1,
  },
  {
    id: 'first_apply',
    icon: '\u2699\uFE0F',
    category: 'applying',
    check: (s) => s.appliedCount >= 1,
  },
  {
    id: 'first_share',
    icon: '\uD83E\uDD1D',
    category: 'sharing',
    check: (s) => s.sharedCount >= 1,
  },
  {
    id: 'ten_learned',
    icon: '\uD83D\uDCDA',
    category: 'learning',
    check: (s) => s.learnedCount >= 10,
  },
  {
    id: 'five_applied',
    icon: '\uD83D\uDD27',
    category: 'applying',
    check: (s) => s.appliedCount >= 5,
  },
  {
    id: 'taught_five',
    icon: '\uD83C\uDF93',
    category: 'sharing',
    check: (s) => s.distinctPeopleTaught >= 5,
  },
  {
    id: 'full_stack_ai',
    icon: '\uD83C\uDF10',
    category: 'special',
    check: (s) => {
      const allLabels = new Set(PREDEFINED_LABELS);
      return allLabels.size > 0 && [...allLabels].every((l) => s.labelsCovered.includes(l));
    },
  },
  {
    id: 'submitted_one',
    icon: '\u2728',
    category: 'special',
    check: (s) => s.submittedCount >= 1,
  },
  {
    id: 'five_completed',
    icon: '\uD83C\uDFC5',
    category: 'special',
    check: (s) => s.completedCount >= 5,
  },
  {
    id: 'speed_learner',
    icon: '\u26A1',
    category: 'learning',
    check: (s) => s.learnedToday >= 3,
  },
  {
    id: 'twenty_five_learned',
    icon: '\uD83E\uDDE0',
    category: 'learning',
    check: (s) => s.learnedCount >= 25,
  },
  {
    id: 'ten_applied',
    icon: '\uD83D\uDEE0\uFE0F',
    category: 'applying',
    check: (s) => s.appliedCount >= 10,
  },
  {
    id: 'ten_shared',
    icon: '\uD83D\uDCE3',
    category: 'sharing',
    check: (s) => s.sharedCount >= 10,
  },
  {
    id: 'three_submitted',
    icon: '\uD83D\uDCA1',
    category: 'special',
    check: (s) => s.submittedCount >= 3,
  },
  {
    id: 'taught_ten',
    icon: '\uD83C\uDFEB',
    category: 'sharing',
    check: (s) => s.distinctPeopleTaught >= 10,
  },
  {
    id: 'ten_completed',
    icon: '\uD83D\uDC8E',
    category: 'special',
    check: (s) => s.completedCount >= 10,
  },
  {
    id: 'streak_3',
    icon: '\uD83D\uDD25',
    category: 'special',
    check: (s) => s.dailyChallengeStreak >= 3,
  },
  {
    id: 'streak_7',
    icon: '\uD83D\uDD25',
    category: 'special',
    check: (s) => s.dailyChallengeStreak >= 7,
  },
  {
    id: 'streak_30',
    icon: '\uD83D\uDD25',
    category: 'special',
    check: (s) => s.dailyChallengeStreak >= 30,
  },
];

export interface UserBadge {
  badge_id: string;
  earned_at: string;
}

export async function fetchUserBadges(userId: string): Promise<UserBadge[]> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('badge_id, earned_at')
    .eq('user_id', userId)
    .order('earned_at', { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function getUserBadgeStats(userId: string): Promise<UserBadgeStats> {
  // Parallelize the three independent queries
  const [{ data: progressData }, { data: submitted }, { data: shareRecords }] =
    await Promise.all([
      supabase
        .from('user_progress_summary')
        .select('use_case_id, seen_at, done_at, share_count, is_completed')
        .eq('user_id', userId),
      supabase
        .from('use_cases')
        .select('id')
        .eq('submitted_by', userId),
      supabase
        .from('shares')
        .select('recipient_id')
        .eq('sharer_id', userId),
    ]);

  const rows = progressData || [];

  const learnedCount = rows.filter((r: any) => r.seen_at).length;
  const appliedCount = rows.filter((r: any) => r.done_at).length;
  const completedCount = rows.filter((r: any) => r.is_completed).length;
  const sharedCount = rows.reduce((sum: number, r: any) => sum + (r.share_count || 0), 0);
  const submittedCount = submitted?.length || 0;
  const distinctPeopleTaught = new Set((shareRecords || []).map((s: any) => s.recipient_id)).size;

  // Fetch labels of completed use cases + streak in parallel
  const completedUseCaseIds = rows.filter((r: any) => r.is_completed).map((r: any) => r.use_case_id);
  const { calculateStreak } = await import('./dailyChallenge');
  const { getLocalDateString } = await import('../dailyChallenge');

  const [labelsResult, dailyChallengeStreak] = await Promise.all([
    completedUseCaseIds.length > 0
      ? supabase.from('use_cases').select('labels').in('id', completedUseCaseIds)
      : Promise.resolve({ data: [] as any[] }),
    calculateStreak(userId, getLocalDateString()),
  ]);

  const allLabels = (labelsResult.data || []).flatMap((uc: any) => uc.labels || []);
  const labelsCovered = [...new Set(allLabels)];

  // Count learned today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const learnedToday = rows.filter((r: any) => r.seen_at && new Date(r.seen_at) >= todayStart).length;

  return {
    learnedCount,
    appliedCount,
    completedCount,
    sharedCount,
    submittedCount,
    distinctPeopleTaught,
    labelsCovered,
    learnedToday,
    dailyChallengeStreak,
  };
}

export async function checkAndAwardBadges(userId: string): Promise<string[]> {
  const [stats, existing] = await Promise.all([
    getUserBadgeStats(userId),
    fetchUserBadges(userId),
  ]);

  const existingIds = new Set(existing.map((b) => b.badge_id));

  // Determine which badges are newly earned
  const badgesToAward = BADGE_DEFINITIONS.filter(
    (badge) => !existingIds.has(badge.id) && badge.check(stats)
  );

  if (badgesToAward.length === 0) return [];

  // Batch insert all new badges at once
  const { error } = await supabase
    .from('user_badges')
    .upsert(
      badgesToAward.map((b) => ({ user_id: userId, badge_id: b.id })),
      { onConflict: 'user_id,badge_id' }
    );

  if (error) return [];

  const newBadges = badgesToAward.map((b) => b.id);

  // Fire-and-forget notifications in parallel
  for (const badge of badgesToAward) {
    createNotification(
      userId,
      'badge_earned',
      `Badge Earned: ${badge.icon}`,
      `You earned the "${badge.id}" badge!`,
      { badge_id: badge.id }
    ).catch(() => {});
  }

  return newBadges;
}
