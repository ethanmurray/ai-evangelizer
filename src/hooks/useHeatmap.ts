'use client';

import { useState, useEffect } from 'react';
import { fetchAdoptionHeatmap, fetchAdoptionByLabel, HeatmapCell, LabelHeatmapGroup } from '@/lib/data/heatmap';

export function useHeatmap() {
  const [cells, setCells] = useState<HeatmapCell[]>([]);
  const [byLabel, setByLabel] = useState<LabelHeatmapGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchAdoptionByLabel()
      .then((groups) => {
        setByLabel(groups);
        setCells(groups.flatMap((g) => g.cells));
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { cells, byLabel, isLoading };
}
