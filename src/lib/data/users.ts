import { supabase } from '../supabase';

export async function deleteUser(userId: string): Promise<void> {
  // Fetch email for teacher attribution cleanup (attributions uses teacher_email, not id)
  const { data: userRow } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .single();

  const { error: magicLinksError } = await supabase
    .from('magic_links')
    .delete()
    .eq('user_id', userId);
  if (magicLinksError) throw new Error(magicLinksError.message);

  // Clean up attributions where this user was the learner
  const { error: attributionsLearnerError } = await supabase
    .from('attributions')
    .delete()
    .eq('learner_id', userId);
  if (attributionsLearnerError) throw new Error(attributionsLearnerError.message);

  // Clean up attributions where this user was the teacher
  if (userRow?.email) {
    const { error: attributionsTeacherError } = await supabase
      .from('attributions')
      .delete()
      .eq('teacher_email', userRow.email);
    if (attributionsTeacherError) throw new Error(attributionsTeacherError.message);
  }

  const { error: sharesSharerError } = await supabase
    .from('shares')
    .delete()
    .eq('sharer_id', userId);
  if (sharesSharerError) throw new Error(sharesSharerError.message);

  const { error: sharesRecipientError } = await supabase
    .from('shares')
    .delete()
    .eq('recipient_id', userId);
  if (sharesRecipientError) throw new Error(sharesRecipientError.message);

  const { error: progressError } = await supabase
    .from('progress')
    .delete()
    .eq('user_id', userId);
  if (progressError) throw new Error(progressError.message);

  const { error: upvotesError } = await supabase
    .from('upvotes')
    .delete()
    .eq('user_id', userId);
  if (upvotesError) throw new Error(upvotesError.message);

  const { error: useCasesError } = await supabase
    .from('use_cases')
    .update({ submitted_by: null })
    .eq('submitted_by', userId);
  if (useCasesError) throw new Error(useCasesError.message);

  const { error: userError } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);
  if (userError) throw new Error(userError.message);
}
