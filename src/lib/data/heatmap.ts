import { supabase } from '../supabase';
import { PREDEFINED_LABELS } from './use-cases';

export type HeatLevel = 'cold' | 'cool' | 'warm' | 'hot';

export interface HeatmapCell {
  id: string;
  title: string;
  labels: string[];
  learnedCount: number;
  appliedCount: number;
  completedCount: number;
  totalUsers: number;
  adoptionPercent: number;
  heatLevel: HeatLevel;
}

export interface LabelHeatmapGroup {
  label: string;
  cells: HeatmapCell[];
  avgAdoption: number;
}

function getHeatLevel(percent: number): HeatLevel {
  if (percent >= 60) return 'hot';
  if (percent >= 30) return 'warm';
  if (percent >= 10) return 'cool';
  return 'cold';
}

export async function fetchAdoptionHeatmap(): Promise<HeatmapCell[]> {
  // Get total non-stub user count
  const { count: totalUsers } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('is_stub', false);

  const total = totalUsers || 1;

  // Get all use cases
  const { data: useCases } = await supabase
    .from('use_cases')
    .select('id, title, labels');

  if (!useCases || useCases.length === 0) return [];

  // Get all progress
  const { data: progress } = await supabase
    .from('user_progress_summary')
    .select('use_case_id, user_id, seen_at, done_at, is_completed');

  // Aggregate per use case
  const statsMap = new Map<string, { learned: Set<string>; applied: Set<string>; completed: Set<string> }>();
  for (const p of progress || []) {
    const s = statsMap.get(p.use_case_id) || { learned: new Set(), applied: new Set(), completed: new Set() };
    if (p.seen_at) s.learned.add(p.user_id);
    if (p.done_at) s.applied.add(p.user_id);
    if (p.is_completed) s.completed.add(p.user_id);
    statsMap.set(p.use_case_id, s);
  }

  return useCases.map((uc: any) => {
    const s = statsMap.get(uc.id) || { learned: new Set(), applied: new Set(), completed: new Set() };
    const learnedCount = s.learned.size;
    const adoptionPercent = Math.round((learnedCount / total) * 100);

    return {
      id: uc.id,
      title: uc.title,
      labels: uc.labels || [],
      learnedCount,
      appliedCount: s.applied.size,
      completedCount: s.completed.size,
      totalUsers: total,
      adoptionPercent,
      heatLevel: getHeatLevel(adoptionPercent),
    };
  });
}

export async function fetchAdoptionByLabel(): Promise<LabelHeatmapGroup[]> {
  const cells = await fetchAdoptionHeatmap();

  const groups = new Map<string, HeatmapCell[]>();
  for (const label of PREDEFINED_LABELS) {
    groups.set(label, []);
  }

  for (const cell of cells) {
    for (const label of cell.labels) {
      const group = groups.get(label);
      if (group) group.push(cell);
    }
  }

  // Also handle cells with no matching predefined label
  const uncategorized = cells.filter(
    (c) => c.labels.length === 0 || !c.labels.some((l: string) => PREDEFINED_LABELS.includes(l as any))
  );
  if (uncategorized.length > 0) {
    groups.set('Other', uncategorized);
  }

  return Array.from(groups.entries())
    .filter(([, cells]) => cells.length > 0)
    .map(([label, cells]) => {
      const avgAdoption = cells.length > 0
        ? Math.round(cells.reduce((sum, c) => sum + c.adoptionPercent, 0) / cells.length)
        : 0;
      return {
        label,
        cells: cells.sort((a, b) => b.adoptionPercent - a.adoptionPercent),
        avgAdoption,
      };
    })
    .sort((a, b) => b.avgAdoption - a.avgAdoption);
}
