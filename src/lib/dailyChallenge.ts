// Daily challenge definitions, workday logic, and selection functions.
// Pure utility — no side effects, no Supabase imports.

export type ChallengeType =
  | 'upvote' | 'follow' | 'rate'      // easy
  | 'learn' | 'comment' | 'reply'     // medium
  | 'apply' | 'share' | 'submit';     // hard

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ChallengeDefinition {
  type: ChallengeType;
  difficulty: Difficulty;
  title: string;
  description: string;
  icon: string;
}

export const EASY_CHALLENGES: ChallengeDefinition[] = [
  { type: 'upvote', difficulty: 'easy', title: 'Show appreciation', description: 'Upvote a use case you find valuable', icon: '\uD83D\uDC4D' },
  { type: 'follow', difficulty: 'easy', title: 'Stay in the loop', description: 'Follow a use case for updates', icon: '\uD83D\uDD14' },
  { type: 'rate', difficulty: 'easy', title: 'Rate a skill', description: 'Rate the difficulty of a use case', icon: '\u2B50' },
];

export const MEDIUM_CHALLENGES: ChallengeDefinition[] = [
  { type: 'learn', difficulty: 'medium', title: 'Learn something new', description: 'Mark a use case as learned', icon: '\uD83D\uDC41\uFE0F' },
  { type: 'comment', difficulty: 'medium', title: 'Join the conversation', description: 'Leave a comment or tip', icon: '\uD83D\uDCAC' },
  { type: 'reply', difficulty: 'medium', title: 'Help a colleague', description: 'Reply to someone\'s comment', icon: '\uD83D\uDE4B' },
];

export const HARD_CHALLENGES: ChallengeDefinition[] = [
  { type: 'apply', difficulty: 'hard', title: 'Put it into practice', description: 'Apply a use case you\'ve learned', icon: '\u2699\uFE0F' },
  { type: 'share', difficulty: 'hard', title: 'Spread the word', description: 'Share a use case with a colleague', icon: '\uD83E\uDD1D' },
  { type: 'submit', difficulty: 'hard', title: 'Create new content', description: 'Submit a new use case to the library', icon: '\u2728' },
];

// Re-export from the single source of truth
export { POINTS_CONFIG } from './points';
import { POINTS_CONFIG } from './points';
export const DAILY_CHALLENGE_BONUS_POINTS = POINTS_CONFIG.dailyChallenge;

// --- Workday logic ---

/**
 * Get US federal holidays for a given year.
 * Computes floating holidays (MLK Day, Presidents Day, etc.) dynamically.
 */
export function getUSFederalHolidays(year: number): string[] {
  const holidays: string[] = [];
  const fmt = (m: number, d: number) =>
    `${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  // Fixed-date holidays
  holidays.push(fmt(1, 1));   // New Year's Day
  holidays.push(fmt(7, 4));   // Independence Day
  holidays.push(fmt(11, 11)); // Veterans Day
  holidays.push(fmt(12, 25)); // Christmas Day

  // Nth weekday helpers
  const nthDayOfWeek = (month: number, dayOfWeek: number, n: number): number => {
    // dayOfWeek: 0=Sun, 1=Mon, ...
    const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    let day = 1 + ((dayOfWeek - first + 7) % 7) + (n - 1) * 7;
    return day;
  };

  const lastDayOfWeek = (month: number, dayOfWeek: number): number => {
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const lastDow = new Date(Date.UTC(year, month - 1, lastDay)).getUTCDay();
    return lastDay - ((lastDow - dayOfWeek + 7) % 7);
  };

  // MLK Day — 3rd Monday of January
  holidays.push(fmt(1, nthDayOfWeek(1, 1, 3)));

  // Presidents' Day — 3rd Monday of February
  holidays.push(fmt(2, nthDayOfWeek(2, 1, 3)));

  // Memorial Day — last Monday of May
  holidays.push(fmt(5, lastDayOfWeek(5, 1)));

  // Labor Day — 1st Monday of September
  holidays.push(fmt(9, nthDayOfWeek(9, 1, 1)));

  // Columbus Day — 2nd Monday of October
  holidays.push(fmt(10, nthDayOfWeek(10, 1, 2)));

  // Thanksgiving — 4th Thursday of November
  const thanksgivingDay = nthDayOfWeek(11, 4, 4);
  holidays.push(fmt(11, thanksgivingDay));

  // Day after Thanksgiving — 4th Friday of November
  holidays.push(fmt(11, thanksgivingDay + 1));

  return holidays;
}

/**
 * Check if a UTC date string (YYYY-MM-DD) is a workday.
 * Returns false for weekends and US federal holidays.
 */
export function isWorkday(dateStr: string): boolean {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const dow = date.getUTCDay();

  // Weekend
  if (dow === 0 || dow === 6) return false;

  // Holiday
  const holidays = getUSFederalHolidays(y);
  return !holidays.includes(dateStr);
}

/**
 * Get the next workday on or after the given date.
 */
export function getNextWorkday(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));

  for (let i = 0; i < 10; i++) {
    const candidate = new Date(date.getTime() + i * 86400000);
    const str = getLocalDateString(candidate);
    if (isWorkday(str)) return str;
  }

  return dateStr; // fallback
}

/**
 * Get the previous workday strictly before the given date.
 */
export function getPreviousWorkday(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));

  for (let i = 1; i <= 10; i++) {
    const candidate = new Date(date.getTime() - i * 86400000);
    const str = getLocalDateString(candidate);
    if (isWorkday(str)) return str;
  }

  return dateStr; // fallback
}

// --- Date utilities ---

export function getLocalDateString(date?: Date): string {
  const d = date || new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Get the weekday name for a YYYY-MM-DD date string.
 */
export function getWeekdayName(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

// --- Challenge selection ---

/**
 * Simple deterministic hash of a string, returns a non-negative integer.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Get today's 3 challenges (1 easy, 1 medium, 1 hard).
 * Returns null if the date is not a workday.
 */
export function getTodaysChallenges(dateStr?: string): ChallengeDefinition[] | null {
  const ds = dateStr || getLocalDateString();

  if (!isWorkday(ds)) return null;

  const easyIdx = hashString(ds + 'easy') % EASY_CHALLENGES.length;
  const medIdx = hashString(ds + 'medium') % MEDIUM_CHALLENGES.length;
  const hardIdx = hashString(ds + 'hard') % HARD_CHALLENGES.length;

  return [
    EASY_CHALLENGES[easyIdx],
    MEDIUM_CHALLENGES[medIdx],
    HARD_CHALLENGES[hardIdx],
  ];
}
