'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchRelatedUseCases, Recommendation } from '@/lib/data/recommendations';

export function useRelatedUseCases(useCaseId: string | undefined, limit = 4) {
  const [related, setRelated] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (!useCaseId || fetched.current) return;
    fetched.current = true;
    setIsLoading(true);
    fetchRelatedUseCases(useCaseId, limit)
      .then(setRelated)
      .finally(() => setIsLoading(false));
  }, [useCaseId, limit]);

  return { related, isLoading };
}
