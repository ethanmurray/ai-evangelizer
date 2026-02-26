'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchSkillRadar, SkillRadarPoint } from '@/lib/data/skill-radar';

export function useSkillRadar(userId: string | undefined) {
  const [data, setData] = useState<SkillRadarPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const result = await fetchSkillRadar(userId);
      setData(result);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading };
}
