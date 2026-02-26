'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const DISMISSED_KEY = 'cult_of_ai_onboarding_dismissed';

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  href: string;
}

export function useOnboardingChecklist(userId: string | undefined) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [dismissed, setDismissed] = useState(true); // default to hidden
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Check dismissed state
    const wasDismissed = localStorage.getItem(DISMISSED_KEY) === 'true';
    setDismissed(wasDismissed);
    if (wasDismissed) {
      setIsLoading(false);
      return;
    }

    // Fetch user's progress data
    async function load() {
      const [progressRes, sharesRes, upvotesRes, ratingsRes] = await Promise.all([
        supabase
          .from('user_progress_summary')
          .select('seen_at, done_at')
          .eq('user_id', userId!),
        supabase
          .from('shares')
          .select('id')
          .eq('sharer_id', userId!)
          .limit(1),
        supabase
          .from('upvotes')
          .select('id')
          .eq('user_id', userId!)
          .limit(1),
        supabase
          .from('difficulty_ratings')
          .select('id')
          .eq('user_id', userId!)
          .limit(1),
      ]);

      const progress = progressRes.data || [];
      const hasLearned = progress.some((p: any) => p.seen_at);
      const hasApplied = progress.some((p: any) => p.done_at);
      const hasShared = (sharesRes.data || []).length > 0;
      const hasUpvoted = (upvotesRes.data || []).length > 0;
      const hasRated = (ratingsRes.data || []).length > 0;

      setItems([
        { id: 'learn', label: 'Learn your first use case', completed: hasLearned, href: '/library' },
        { id: 'apply', label: 'Apply a use case', completed: hasApplied, href: '/library' },
        { id: 'share', label: 'Share with a colleague', completed: hasShared, href: '/library' },
        { id: 'upvote', label: 'Upvote a use case', completed: hasUpvoted, href: '/library' },
        { id: 'rate', label: 'Rate a use case difficulty', completed: hasRated, href: '/library' },
      ]);
      setIsLoading(false);
    }

    load();
  }, [userId]);

  const allComplete = items.length > 0 && items.every((i) => i.completed);

  function dismiss() {
    setDismissed(true);
    localStorage.setItem(DISMISSED_KEY, 'true');
  }

  const visible = !isLoading && !dismissed && !allComplete;

  return { items, visible, dismiss, allComplete };
}
