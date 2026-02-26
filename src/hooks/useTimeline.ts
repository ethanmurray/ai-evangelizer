'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchUserTimeline, TimelineEvent } from '@/lib/data/timeline';

export function useTimeline(userId: string | undefined) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await fetchUserTimeline(userId);
      setEvents(data);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { events, isLoading };
}
