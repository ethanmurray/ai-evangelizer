import { supabase } from '../supabase';
import { checkAndAwardBadges } from './badges';
import { logActivity } from './activity';

export const PREDEFINED_LABELS = [
  'Coding',
  'Code Generation',
  'Code Quality',
  'Testing',
  'Debugging',
  'Documentation',
  'Writing',
  'Data',
  'SQL',
  'Text Processing',
  'Automation',
  'DevOps',
  'Git',
  'APIs',
  'Learning',
  'Frameworks',
] as const;

export type UseCaseLabel = (typeof PREDEFINED_LABELS)[number];

export interface UseCase {
  id: string;
  title: string;
  description: string;
  resources: string | null;
  submitted_by: string | null;
  created_at: string;
  labels: string[];
  upvote_count?: number;
}

export interface UseCaseWithProgress extends UseCase {
  seen_at: string | null;
  done_at: string | null;
  share_count: number;
  is_completed: boolean;
}

export async function fetchUseCases(search?: string, labels?: string[]): Promise<UseCase[]> {
  let query = supabase
    .from('use_cases')
    .select('*')
    .order('created_at', { ascending: true });

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (labels && labels.length > 0) {
    query = query.overlaps('labels', labels);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  // Fetch upvote counts
  const { data: upvotes } = await supabase
    .from('use_case_upvote_counts')
    .select('*');

  const upvoteMap = new Map(
    (upvotes || []).map((u: any) => [u.use_case_id, u.upvote_count])
  );

  return (data || []).map((uc: any) => ({
    ...uc,
    labels: uc.labels || [],
    upvote_count: upvoteMap.get(uc.id) || 0,
  }));
}

export async function fetchUseCase(id: string): Promise<UseCase | null> {
  const { data, error } = await supabase
    .from('use_cases')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return { ...data, labels: data.labels || [] };
}

export async function fetchUseCaseWithProgress(
  useCaseId: string,
  userId: string
): Promise<UseCaseWithProgress | null> {
  const uc = await fetchUseCase(useCaseId);
  if (!uc) return null;

  const { data: progress } = await supabase
    .from('user_progress_summary')
    .select('*')
    .eq('user_id', userId)
    .eq('use_case_id', useCaseId)
    .maybeSingle();

  const { data: upvotes } = await supabase
    .from('use_case_upvote_counts')
    .select('*')
    .eq('use_case_id', useCaseId)
    .maybeSingle();

  return {
    ...uc,
    upvote_count: upvotes?.upvote_count || 0,
    seen_at: progress?.seen_at || null,
    done_at: progress?.done_at || null,
    share_count: progress?.share_count || 0,
    is_completed: progress?.is_completed || false,
  };
}

export async function createUseCase(
  title: string,
  description: string,
  resources: string | null,
  submittedBy: string,
  labels: string[] = []
): Promise<UseCase> {
  const { data, error } = await supabase
    .from('use_cases')
    .insert({
      title,
      description,
      resources,
      submitted_by: submittedBy,
      labels,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Check badges (fire-and-forget)
  checkAndAwardBadges(submittedBy).catch(() => {});

  // Log activity (fire-and-forget)
  const { data: actor } = await supabase.from('users').select('team').eq('id', submittedBy).single();
  logActivity('submitted', submittedBy, data.id, actor?.team).catch(() => {});

  return data;
}

export async function updateUseCase(
  id: string,
  updates: {
    title?: string;
    description?: string;
    resources?: string;
    labels?: string[];
  }
): Promise<void> {
  const { error } = await supabase
    .from('use_cases')
    .update(updates)
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteUseCase(id: string): Promise<void> {
  const { error: sharesError } = await supabase
    .from('shares')
    .delete()
    .eq('use_case_id', id);
  if (sharesError) throw new Error(sharesError.message);

  const { error: progressError } = await supabase
    .from('progress')
    .delete()
    .eq('use_case_id', id);
  if (progressError) throw new Error(progressError.message);

  const { error: upvotesError } = await supabase
    .from('upvotes')
    .delete()
    .eq('use_case_id', id);
  if (upvotesError) throw new Error(upvotesError.message);

  const { error: useCaseError } = await supabase
    .from('use_cases')
    .delete()
    .eq('id', id);
  if (useCaseError) throw new Error(useCaseError.message);
}
