'use client';

import { useState, useEffect } from 'react';
import { getUserBadgeStats, fetchUserBadges, BADGE_DEFINITIONS, type UserBadgeStats, type UserBadge } from '@/lib/data/badges';

export interface BadgeProgress {
  id: string;
  icon: string;
  category: string;
  earned: boolean;
  earnedAt: string | null;
  progress: number; // 0-1
  progressLabel: string;
}

function getProgressInfo(id: string, stats: UserBadgeStats): { progress: number; label: string } {
  switch (id) {
    case 'first_learn': return { progress: Math.min(stats.learnedCount, 1), label: `${Math.min(stats.learnedCount, 1)}/1` };
    case 'first_apply': return { progress: Math.min(stats.appliedCount, 1), label: `${Math.min(stats.appliedCount, 1)}/1` };
    case 'first_share': return { progress: Math.min(stats.sharedCount, 1), label: `${Math.min(stats.sharedCount, 1)}/1` };
    case 'ten_learned': return { progress: Math.min(stats.learnedCount / 10, 1), label: `${Math.min(stats.learnedCount, 10)}/10` };
    case 'five_applied': return { progress: Math.min(stats.appliedCount / 5, 1), label: `${Math.min(stats.appliedCount, 5)}/5` };
    case 'taught_five': return { progress: Math.min(stats.distinctPeopleTaught / 5, 1), label: `${Math.min(stats.distinctPeopleTaught, 5)}/5` };
    case 'submitted_one': return { progress: Math.min(stats.submittedCount, 1), label: `${Math.min(stats.submittedCount, 1)}/1` };
    case 'five_completed': return { progress: Math.min(stats.completedCount / 5, 1), label: `${Math.min(stats.completedCount, 5)}/5` };
    case 'speed_learner': return { progress: Math.min(stats.learnedToday / 3, 1), label: `${Math.min(stats.learnedToday, 3)}/3 today` };
    case 'twenty_five_learned': return { progress: Math.min(stats.learnedCount / 25, 1), label: `${Math.min(stats.learnedCount, 25)}/25` };
    case 'ten_applied': return { progress: Math.min(stats.appliedCount / 10, 1), label: `${Math.min(stats.appliedCount, 10)}/10` };
    case 'ten_shared': return { progress: Math.min(stats.sharedCount / 10, 1), label: `${Math.min(stats.sharedCount, 10)}/10` };
    case 'three_submitted': return { progress: Math.min(stats.submittedCount / 3, 1), label: `${Math.min(stats.submittedCount, 3)}/3` };
    case 'taught_ten': return { progress: Math.min(stats.distinctPeopleTaught / 10, 1), label: `${Math.min(stats.distinctPeopleTaught, 10)}/10` };
    case 'ten_completed': return { progress: Math.min(stats.completedCount / 10, 1), label: `${Math.min(stats.completedCount, 10)}/10` };
    case 'full_stack_ai': {
      const total = 16; // PREDEFINED_LABELS count
      return { progress: Math.min(stats.labelsCovered.length / total, 1), label: `${stats.labelsCovered.length}/${total} labels` };
    }
    default: return { progress: 0, label: '' };
  }
}

export function useBadgeProgress(userId: string | undefined) {
  const [badges, setBadges] = useState<BadgeProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);

    Promise.all([getUserBadgeStats(userId), fetchUserBadges(userId)])
      .then(([stats, earned]) => {
        const earnedMap = new Map<string, UserBadge>(earned.map((b) => [b.badge_id, b]));
        const result = BADGE_DEFINITIONS.map((def) => {
          const earnedBadge = earnedMap.get(def.id);
          const info = getProgressInfo(def.id, stats);
          return {
            id: def.id,
            icon: def.icon,
            category: def.category,
            earned: !!earnedBadge,
            earnedAt: earnedBadge?.earned_at ?? null,
            progress: earnedBadge ? 1 : info.progress,
            progressLabel: info.label,
          };
        });
        setBadges(result);
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  return { badges, isLoading };
}
