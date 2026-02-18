import { supabase } from '../supabase';

export interface UseCase {
  id: string;
  title: string;
  description: string;
  resources: string | null;
  submitted_by: string | null;
  created_at: string;
  upvote_count?: number;
}

export interface UseCaseWithProgress extends UseCase {
  seen_at: string | null;
  done_at: string | null;
  share_count: number;
  is_completed: boolean;
}

export async function fetchUseCases(search?: string): Promise<UseCase[]> {
  let query = supabase
    .from('use_cases')
    .select('*')
    .order('created_at', { ascending: true });

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
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
  return data;
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
  submittedBy: string
): Promise<UseCase> {
  const { data, error } = await supabase
    .from('use_cases')
    .insert({
      title,
      description,
      resources,
      submitted_by: submittedBy,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
