import { supabase } from '../supabase';

export type FollowFrequency = 'instant' | 'daily' | 'off';

export async function getFollowStatus(
  userId: string,
  useCaseId: string
): Promise<FollowFrequency | null> {
  const { data } = await supabase
    .from('use_case_follows')
    .select('frequency')
    .eq('user_id', userId)
    .eq('use_case_id', useCaseId)
    .maybeSingle();
  return (data?.frequency as FollowFrequency) || null;
}

export async function setFollow(
  userId: string,
  useCaseId: string,
  frequency: FollowFrequency
): Promise<void> {
  await supabase
    .from('use_case_follows')
    .upsert(
      {
        user_id: userId,
        use_case_id: useCaseId,
        frequency,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,use_case_id' }
    );
}

export async function getFollowersForUseCase(
  useCaseId: string,
  frequency?: FollowFrequency
): Promise<Array<{ user_id: string }>> {
  let query = supabase
    .from('use_case_follows')
    .select('user_id')
    .eq('use_case_id', useCaseId)
    .neq('frequency', 'off');

  if (frequency) {
    query = query.eq('frequency', frequency);
  }

  const { data } = await query;
  return data || [];
}

export async function addToDigestQueue(
  followerId: string,
  useCaseId: string,
  commentId: string
): Promise<void> {
  await supabase.from('follow_digest_queue').insert({
    follower_id: followerId,
    use_case_id: useCaseId,
    comment_id: commentId,
  });
}
