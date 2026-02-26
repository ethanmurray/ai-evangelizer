'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchActivityFeed, ActivityEvent } from '@/lib/data/activity';

export function useActivityFeed(teamFilter?: string) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchActivityFeed(50, undefined, teamFilter);
      setEvents(data);
      setHasMore(data.length === 50);
    } finally {
      setIsLoading(false);
    }
  }, [teamFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = useCallback(async () => {
    if (events.length === 0 || !hasMore) return;
    const lastEvent = events[events.length - 1];
    const moreData = await fetchActivityFeed(50, lastEvent.created_at, teamFilter);
    setEvents((prev) => [...prev, ...moreData]);
    setHasMore(moreData.length === 50);
  }, [events, hasMore, teamFilter]);

  return { events, isLoading, hasMore, loadMore, refresh: load };
}
