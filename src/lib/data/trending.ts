import { supabase } from '../supabase';

export interface TrendingUseCase {
  id: string;
  title: string;
  labels: string[];
  recentUpvotes: number;
}

export async function fetchTrendingUseCases(
  days: number = 7,
  limit: number = 5
): Promise<TrendingUseCase[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data: recentUpvotes, error } = await supabase
    .from('upvotes')
    .select('use_case_id')
    .gte('created_at', since.toISOString());

  if (error || !recentUpvotes || recentUpvotes.length === 0) return [];

  // Count upvotes per use case
  const freq = new Map<string, number>();
  for (const u of recentUpvotes) {
    freq.set(u.use_case_id, (freq.get(u.use_case_id) || 0) + 1);
  }

  // Get top N
  const ranked = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  if (ranked.length === 0) return [];

  const topIds = ranked.map(([id]) => id);
  const countMap = new Map(ranked);

  // Fetch use case details
  const { data: useCases } = await supabase
    .from('use_cases')
    .select('id, title, labels')
    .in('id', topIds);

  if (!useCases) return [];

  return useCases
    .map((uc: any) => ({
      id: uc.id,
      title: uc.title,
      labels: uc.labels || [],
      recentUpvotes: countMap.get(uc.id) || 0,
    }))
    .sort((a, b) => b.recentUpvotes - a.recentUpvotes);
}
