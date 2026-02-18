import { supabase } from '../supabase';

export async function toggleUpvote(userId: string, useCaseId: string): Promise<boolean> {
  const { data: existing } = await supabase
    .from('upvotes')
    .select('id')
    .eq('user_id', userId)
    .eq('use_case_id', useCaseId)
    .maybeSingle();

  if (existing) {
    await supabase.from('upvotes').delete().eq('id', existing.id);
    return false;
  } else {
    await supabase.from('upvotes').insert({ user_id: userId, use_case_id: useCaseId });
    return true;
  }
}

export async function hasUpvoted(userId: string, useCaseId: string): Promise<boolean> {
  const { data } = await supabase
    .from('upvotes')
    .select('id')
    .eq('user_id', userId)
    .eq('use_case_id', useCaseId)
    .maybeSingle();

  return !!data;
}

export async function getUpvoteCount(useCaseId: string): Promise<number> {
  const { data } = await supabase
    .from('use_case_upvote_counts')
    .select('upvote_count')
    .eq('use_case_id', useCaseId)
    .maybeSingle();

  return data?.upvote_count || 0;
}
