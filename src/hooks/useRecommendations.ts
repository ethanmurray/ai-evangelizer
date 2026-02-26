'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchRecommendations, Recommendation } from '@/lib/data/recommendations';

export function useRecommendations(userId: string | undefined, limit = 5) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (!userId || fetched.current) return;
    fetched.current = true;
    setIsLoading(true);
    fetchRecommendations(userId, limit)
      .then(setRecommendations)
      .finally(() => setIsLoading(false));
  }, [userId, limit]);

  return { recommendations, isLoading };
}
