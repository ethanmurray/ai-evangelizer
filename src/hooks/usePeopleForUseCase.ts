'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchPeopleForUseCase, UseCasePeopleResult } from '@/lib/data/progress';

export function usePeopleForUseCase(useCaseId: string, userId: string | undefined) {
  const [people, setPeople] = useState<UseCasePeopleResult>({
    recruited: [],
    initiated: [],
    witnessed: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await fetchPeopleForUseCase(useCaseId, userId);
      setPeople(data);
    } finally {
      setIsLoading(false);
    }
  }, [useCaseId, userId]);

  useEffect(() => {
    load();
  }, [load]);

  const totalCount = people.recruited.length + people.initiated.length + people.witnessed.length;

  return { people, totalCount, isLoading, refresh: load };
}
