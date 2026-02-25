import { supabase } from '../supabase';
import { findUserByEmail, createStubUser } from '../auth/utils/database';

export async function markSeen(userId: string, useCaseId: string): Promise<void> {
  const { data: existing } = await supabase
    .from('progress')
    .select('id, seen_at')
    .eq('user_id', userId)
    .eq('use_case_id', useCaseId)
    .maybeSingle();

  if (existing) {
    if (!existing.seen_at) {
      await supabase
        .from('progress')
        .update({ seen_at: new Date().toISOString() })
        .eq('id', existing.id);
    }
  } else {
    await supabase
      .from('progress')
      .insert({
        user_id: userId,
        use_case_id: useCaseId,
        seen_at: new Date().toISOString(),
      });
  }
}

export async function markDone(userId: string, useCaseId: string): Promise<void> {
  const { data: existing } = await supabase
    .from('progress')
    .select('id, seen_at')
    .eq('user_id', userId)
    .eq('use_case_id', useCaseId)
    .maybeSingle();

  const now = new Date().toISOString();

  if (existing) {
    await supabase
      .from('progress')
      .update({
        seen_at: existing.seen_at || now,
        done_at: now,
      })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('progress')
      .insert({
        user_id: userId,
        use_case_id: useCaseId,
        seen_at: now,
        done_at: now,
      });
  }
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface ShareResult {
  id: string;
  confirmationToken: string;
}

export async function shareWithRecipient(
  sharerId: string,
  recipientEmail: string,
  useCaseId: string,
  sharerTeam: string
): Promise<ShareResult> {
  // Find or create recipient
  let recipient = await findUserByEmail(recipientEmail);
  if (!recipient) {
    recipient = await createStubUser(recipientEmail, sharerTeam);
  }

  const confirmationToken = generateToken();

  // Create share record with token in one atomic insert
  const { data: share, error } = await supabase
    .from('shares')
    .insert({
      sharer_id: sharerId,
      recipient_id: recipient.id,
      use_case_id: useCaseId,
      confirmation_token: confirmationToken,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error || !share) {
    throw new Error(error?.message || 'Failed to create share');
  }

  // Auto-mark recipient's progress as seen
  const { data: existingProgress } = await supabase
    .from('progress')
    .select('id')
    .eq('user_id', recipient.id)
    .eq('use_case_id', useCaseId)
    .maybeSingle();

  if (!existingProgress) {
    await supabase
      .from('progress')
      .insert({
        user_id: recipient.id,
        use_case_id: useCaseId,
        seen_at: new Date().toISOString(),
      });
  }

  return { id: share.id, confirmationToken };
}

export interface UserProgressItem {
  use_case_id: string;
  seen_at: string | null;
  done_at: string | null;
  share_count: number;
  is_completed: boolean;
}

export async function fetchUserProgress(userId: string): Promise<UserProgressItem[]> {
  const { data, error } = await supabase
    .from('user_progress_summary')
    .select('*')
    .eq('user_id', userId);

  if (error) return [];
  return data || [];
}
