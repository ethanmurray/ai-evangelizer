import { supabase } from '../supabase';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  labels: string[];
  upvote_count: number;
  reason: string;
}

/**
 * Fetch personalized recommendations for a user based on co-occurrence:
 * Find users who learned the same use cases → find what else they learned → rank by frequency → exclude already-started
 */
export async function fetchRecommendations(userId: string, limit = 5): Promise<Recommendation[]> {
  // Get the use cases this user has interacted with
  const { data: userProgress } = await supabase
    .from('user_progress_summary')
    .select('use_case_id')
    .eq('user_id', userId);

  const myUseCaseIds = (userProgress || []).map((p: any) => p.use_case_id);

  if (myUseCaseIds.length === 0) {
    // Cold start: return most popular use cases by upvotes
    return fetchPopularFallback(limit);
  }

  // Find other users who also learned these use cases
  const { data: coUsers } = await supabase
    .from('user_progress_summary')
    .select('user_id')
    .in('use_case_id', myUseCaseIds)
    .neq('user_id', userId);

  const coUserIds = [...new Set((coUsers || []).map((r: any) => r.user_id))];

  if (coUserIds.length === 0) {
    return fetchLabelFallback(myUseCaseIds, limit);
  }

  // Find what else those users learned (excluding what current user already has)
  const { data: coProgress } = await supabase
    .from('user_progress_summary')
    .select('use_case_id')
    .in('user_id', coUserIds)
    .not('use_case_id', 'in', `(${myUseCaseIds.join(',')})`);

  // Count frequency
  const freq = new Map<string, number>();
  for (const row of coProgress || []) {
    freq.set(row.use_case_id, (freq.get(row.use_case_id) || 0) + 1);
  }

  // Sort by frequency
  const ranked = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);

  if (ranked.length === 0) {
    return fetchLabelFallback(myUseCaseIds, limit);
  }

  // Fetch use case details
  const { data: useCases } = await supabase
    .from('use_cases')
    .select('id, title, description, labels, upvote_count')
    .in('id', ranked);

  if (!useCases || useCases.length === 0) {
    return fetchLabelFallback(myUseCaseIds, limit);
  }

  // Maintain frequency order
  const ucMap = new Map(useCases.map((uc: any) => [uc.id, uc]));
  const results: Recommendation[] = [];
  for (const id of ranked) {
    const uc = ucMap.get(id);
    if (uc) {
      const count = freq.get(id) || 0;
      results.push({
        id: uc.id,
        title: uc.title,
        description: uc.description || '',
        labels: uc.labels || [],
        upvote_count: uc.upvote_count || 0,
        reason: `${count} people who share your interests also learned this`,
      });
    }
  }

  // If less than limit, pad with label-based fallback
  if (results.length < limit) {
    const fallback = await fetchLabelFallback(myUseCaseIds, limit - results.length, [...myUseCaseIds, ...ranked]);
    results.push(...fallback);
  }

  return results.slice(0, limit);
}

/**
 * Fetch related use cases based on co-occurrence for a specific use case
 */
export async function fetchRelatedUseCases(useCaseId: string, limit = 4): Promise<Recommendation[]> {
  // Find users who learned this use case
  const { data: learners } = await supabase
    .from('user_progress_summary')
    .select('user_id')
    .eq('use_case_id', useCaseId);

  const learnerIds = (learners || []).map((r: any) => r.user_id);

  if (learnerIds.length === 0) {
    return fetchPopularFallback(limit, [useCaseId]);
  }

  // Find what else those users learned
  const { data: coProgress } = await supabase
    .from('user_progress_summary')
    .select('use_case_id')
    .in('user_id', learnerIds)
    .neq('use_case_id', useCaseId);

  const freq = new Map<string, number>();
  for (const row of coProgress || []) {
    freq.set(row.use_case_id, (freq.get(row.use_case_id) || 0) + 1);
  }

  const ranked = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);

  if (ranked.length === 0) {
    // Fallback: find use cases with same labels
    const { data: thisUc } = await supabase
      .from('use_cases')
      .select('labels')
      .eq('id', useCaseId)
      .single();

    if (thisUc?.labels?.length) {
      return fetchByLabelOverlap(thisUc.labels, [useCaseId], limit);
    }
    return fetchPopularFallback(limit, [useCaseId]);
  }

  const { data: useCases } = await supabase
    .from('use_cases')
    .select('id, title, description, labels, upvote_count')
    .in('id', ranked);

  if (!useCases) return [];

  const ucMap = new Map(useCases.map((uc: any) => [uc.id, uc]));
  const results: Recommendation[] = [];
  for (const id of ranked) {
    const uc = ucMap.get(id);
    if (uc) {
      results.push({
        id: uc.id,
        title: uc.title,
        description: uc.description || '',
        labels: uc.labels || [],
        upvote_count: uc.upvote_count || 0,
        reason: `Also learned by ${freq.get(id)} people who know this`,
      });
    }
  }

  return results.slice(0, limit);
}

async function fetchPopularFallback(limit: number, excludeIds: string[] = []): Promise<Recommendation[]> {
  let query = supabase
    .from('use_cases')
    .select('id, title, description, labels, upvote_count')
    .order('upvote_count', { ascending: false })
    .limit(limit + excludeIds.length);

  const { data } = await query;
  if (!data) return [];

  return data
    .filter((uc: any) => !excludeIds.includes(uc.id))
    .slice(0, limit)
    .map((uc: any) => ({
      id: uc.id,
      title: uc.title,
      description: uc.description || '',
      labels: uc.labels || [],
      upvote_count: uc.upvote_count || 0,
      reason: 'Popular with the community',
    }));
}

async function fetchLabelFallback(myUseCaseIds: string[], limit: number, excludeIds: string[] = []): Promise<Recommendation[]> {
  // Get labels from user's use cases
  const { data: myUseCases } = await supabase
    .from('use_cases')
    .select('labels')
    .in('id', myUseCaseIds);

  const myLabels = [...new Set((myUseCases || []).flatMap((uc: any) => uc.labels || []))];

  if (myLabels.length === 0) {
    return fetchPopularFallback(limit, excludeIds.length > 0 ? excludeIds : myUseCaseIds);
  }

  return fetchByLabelOverlap(myLabels, [...myUseCaseIds, ...excludeIds], limit);
}

async function fetchByLabelOverlap(labels: string[], excludeIds: string[], limit: number): Promise<Recommendation[]> {
  // Fetch all use cases and filter by label overlap client-side
  // (Supabase array overlap queries are limited)
  const { data: allUc } = await supabase
    .from('use_cases')
    .select('id, title, description, labels, upvote_count')
    .order('upvote_count', { ascending: false })
    .limit(200);

  if (!allUc) return [];

  const excludeSet = new Set(excludeIds);
  const labelSet = new Set(labels);

  return allUc
    .filter((uc: any) => !excludeSet.has(uc.id))
    .filter((uc: any) => (uc.labels || []).some((l: string) => labelSet.has(l)))
    .slice(0, limit)
    .map((uc: any) => {
      const overlap = (uc.labels || []).filter((l: string) => labelSet.has(l));
      return {
        id: uc.id,
        title: uc.title,
        description: uc.description || '',
        labels: uc.labels || [],
        upvote_count: uc.upvote_count || 0,
        reason: `Similar skills: ${overlap.join(', ')}`,
      };
    });
}
