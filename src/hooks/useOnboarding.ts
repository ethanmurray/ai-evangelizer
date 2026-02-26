'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const ONBOARDING_KEY = 'cult_of_ai_onboarding_completed';

export function useOnboarding(userId: string | undefined) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Check localStorage first (fast path)
    const localFlag = localStorage.getItem(ONBOARDING_KEY);
    if (localFlag === 'true') {
      return;
    }

    // Check database (handles cross-device persistence)
    supabase
      .from('users')
      .select('onboarding_completed_at')
      .eq('id', userId)
      .single()
      .then(({ data }) => {
        if (data?.onboarding_completed_at) {
          // DB says completed, sync to localStorage
          localStorage.setItem(ONBOARDING_KEY, 'true');
        } else {
          // First time user — show onboarding
          setShowOnboarding(true);
        }
      });
  }, [userId]);

  const completeOnboarding = useCallback(async () => {
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDING_KEY, 'true');

    if (userId) {
      await supabase
        .from('users')
        .update({ onboarding_completed_at: new Date().toISOString() })
        .eq('id', userId);
    }
  }, [userId]);

  const replayOnboarding = useCallback(() => {
    setShowOnboarding(true);
  }, []);

  return { showOnboarding, completeOnboarding, replayOnboarding };
}
