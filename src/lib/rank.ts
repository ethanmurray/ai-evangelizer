import type { ContentTheme } from './theme/types';

type Rank = ContentTheme['ranks'][number];

export function getRank(points: number, ranks: Rank[]): Rank {
  let currentRank = ranks[0];
  for (const rank of ranks) {
    if (points >= rank.min) {
      currentRank = rank;
    }
  }
  return currentRank;
}

export function getNextRank(
  points: number,
  ranks: Rank[]
): { rank: Rank; remaining: number } | null {
  for (const rank of ranks) {
    if (points < rank.min) {
      return { rank, remaining: rank.min - points };
    }
  }
  return null;
}

// Backwards compatibility wrapper - to be removed after full migration
export function getRankByCompletedCount(completedCount: number, ranks: Rank[]): Rank {
  // Convert completed count to approximate points (10 points per completion)
  return getRank(completedCount * 10, ranks);
}
