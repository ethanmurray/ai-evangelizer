import type { ContentTheme } from './theme/types';

type Rank = ContentTheme['ranks'][number];

export function getRank(completedCount: number, ranks: Rank[]): Rank {
  let currentRank = ranks[0];
  for (const rank of ranks) {
    if (completedCount >= rank.min) {
      currentRank = rank;
    }
  }
  return currentRank;
}

export function getNextRank(
  completedCount: number,
  ranks: Rank[]
): { rank: Rank; remaining: number } | null {
  for (const rank of ranks) {
    if (completedCount < rank.min) {
      return { rank, remaining: rank.min - completedCount };
    }
  }
  return null;
}
