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
