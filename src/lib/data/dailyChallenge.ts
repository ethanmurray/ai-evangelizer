import { supabase } from '../supabase';
import { checkAndAwardBadges } from './badges';
import {
  getTodaysChallenges,
  getUTCDateString,
  isWorkday,
  getPreviousWorkday,
  type ChallengeDefinition,
  type ChallengeType,
} from '../dailyChallenge';

export interface DailyChallengeItem extends ChallengeDefinition {
  isCompleted: boolean;
}

export interface DailyChallengeStatus {
  challenges: DailyChallengeItem[];
  completedType: ChallengeType | null;
  streak: number;
  date: string;
  isWorkday: boolean;
}

/**
 * Fetch the full daily challenge status for a user.
 */
export async function fetchDailyChallengeStatus(
  userId: string
): Promise<DailyChallengeStatus> {
  const today = getUTCDateString();
  const todayIsWorkday = isWorkday(today);
  const challenges = getTodaysChallenges();

  // Non-workday: return streak only, no challenges
  if (!todayIsWorkday || !challenges) {
    const streak = await calculateStreak(userId, today);
    return { challenges: [], completedType: null, streak, date: today, isWorkday: false };
  }

  // Check if already completed today
  const { data: existing } = await supabase
    .from('daily_challenge_completions')
    .select('challenge_type')
    .eq('user_id', userId)
    .eq('challenge_date', today)
    .maybeSingle();

  if (existing) {
    const streak = await calculateStreak(userId, today);
    return {
      challenges: challenges.map((c) => ({
        ...c,
        isCompleted: c.type === existing.challenge_type,
      })),
      completedType: existing.challenge_type as ChallengeType,
      streak,
      date: today,
      isWorkday: true,
    };
  }

  // Check each challenge for auto-completion
  const todayStart = `${today}T00:00:00.000Z`;
  const tomorrowDate = new Date(Date.now() + 86400000);
  const tomorrowStart = `${getUTCDateString(tomorrowDate)}T00:00:00.000Z`;

  for (const challenge of challenges) {
    const completed = await checkChallengeCompletion(
      userId,
      challenge.type,
      todayStart,
      tomorrowStart
    );
    if (completed) {
      await recordCompletion(userId, today, challenge.type);
      const streak = await calculateStreak(userId, today);
      return {
        challenges: challenges.map((c) => ({
          ...c,
          isCompleted: c.type === challenge.type,
        })),
        completedType: challenge.type,
        streak,
        date: today,
        isWorkday: true,
      };
    }
  }

  // Nothing completed yet
  const streak = await calculateStreak(userId, today);
  return {
    challenges: challenges.map((c) => ({ ...c, isCompleted: false })),
    completedType: null,
    streak,
    date: today,
    isWorkday: true,
  };
}

/**
 * Check if a specific challenge type was completed today.
 */
async function checkChallengeCompletion(
  userId: string,
  type: ChallengeType,
  dayStart: string,
  dayEnd: string
): Promise<boolean> {
  switch (type) {
    case 'learn': {
      const { data } = await supabase
        .from('progress')
        .select('id')
        .eq('user_id', userId)
        .gte('seen_at', dayStart)
        .lt('seen_at', dayEnd)
        .limit(1);
      return (data?.length ?? 0) > 0;
    }
    case 'apply': {
      const { data } = await supabase
        .from('progress')
        .select('id')
        .eq('user_id', userId)
        .gte('done_at', dayStart)
        .lt('done_at', dayEnd)
        .limit(1);
      return (data?.length ?? 0) > 0;
    }
    case 'share': {
      const { data } = await supabase
        .from('shares')
        .select('id')
        .eq('sharer_id', userId)
        .gte('created_at', dayStart)
        .lt('created_at', dayEnd)
        .limit(1);
      return (data?.length ?? 0) > 0;
    }
    case 'comment': {
      const { data } = await supabase
        .from('comments')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', dayStart)
        .lt('created_at', dayEnd)
        .limit(1);
      return (data?.length ?? 0) > 0;
    }
    case 'reply': {
      const { data } = await supabase
        .from('comments')
        .select('id')
        .eq('user_id', userId)
        .not('parent_id', 'is', null)
        .gte('created_at', dayStart)
        .lt('created_at', dayEnd)
        .limit(1);
      return (data?.length ?? 0) > 0;
    }
    case 'rate': {
      const { data } = await supabase
        .from('difficulty_ratings')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', dayStart)
        .lt('created_at', dayEnd)
        .limit(1);
      return (data?.length ?? 0) > 0;
    }
    case 'upvote': {
      const { data } = await supabase
        .from('upvotes')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', dayStart)
        .lt('created_at', dayEnd)
        .limit(1);
      return (data?.length ?? 0) > 0;
    }
    case 'follow': {
      const { data } = await supabase
        .from('use_case_follows')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', dayStart)
        .lt('created_at', dayEnd)
        .limit(1);
      return (data?.length ?? 0) > 0;
    }
    case 'submit': {
      const { data } = await supabase
        .from('use_cases')
        .select('id')
        .eq('submitted_by', userId)
        .gte('created_at', dayStart)
        .lt('created_at', dayEnd)
        .limit(1);
      return (data?.length ?? 0) > 0;
    }
    default:
      return false;
  }
}

/**
 * Record a daily challenge completion.
 */
async function recordCompletion(
  userId: string,
  challengeDate: string,
  challengeType: ChallengeType
): Promise<void> {
  await supabase
    .from('daily_challenge_completions')
    .upsert(
      {
        user_id: userId,
        challenge_date: challengeDate,
        challenge_type: challengeType,
        bonus_points_awarded: true,
      },
      { onConflict: 'user_id,challenge_date' }
    );

  // Check for streak badges (fire-and-forget)
  checkAndAwardBadges(userId).catch(() => {});
}

/**
 * Calculate the current streak of consecutive workday completions.
 * Weekends and holidays are skipped (don't break the streak).
 */
export async function calculateStreak(
  userId: string,
  today: string
): Promise<number> {
  // Fetch last 90 days of completions
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000);
  const { data: completions } = await supabase
    .from('daily_challenge_completions')
    .select('challenge_date')
    .eq('user_id', userId)
    .gte('challenge_date', getUTCDateString(ninetyDaysAgo))
    .order('challenge_date', { ascending: false });

  if (!completions || completions.length === 0) return 0;

  const completedDates = new Set(completions.map((c: any) => c.challenge_date));
  let streak = 0;

  // Start from today if it's a workday and completed, otherwise start from previous workday
  let checkDate = today;
  if (isWorkday(checkDate) && completedDates.has(checkDate)) {
    streak = 1;
    checkDate = getPreviousWorkday(checkDate);
  } else if (isWorkday(checkDate) && !completedDates.has(checkDate)) {
    // Today is a workday but not yet completed — check from previous workday
    checkDate = getPreviousWorkday(checkDate);
  } else {
    // Not a workday — check from previous workday
    checkDate = getPreviousWorkday(checkDate);
  }

  // Walk backwards through workdays
  for (let i = 0; i < 90; i++) {
    if (completedDates.has(checkDate)) {
      streak++;
      checkDate = getPreviousWorkday(checkDate);
    } else {
      break;
    }
  }

  return streak;
}
