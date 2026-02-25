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

export async function unmarkSeen(userId: string, useCaseId: string): Promise<void> {
  await supabase
    .from('progress')
    .update({ seen_at: null, done_at: null })
    .eq('user_id', userId)
    .eq('use_case_id', useCaseId);
}

export async function unmarkDone(userId: string, useCaseId: string): Promise<void> {
  await supabase
    .from('progress')
    .update({ done_at: null })
    .eq('user_id', userId)
    .eq('use_case_id', useCaseId);
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

export type ProgressStatus = 'recruited' | 'initiated' | 'witnessed';

export interface UseCasePerson {
  user_id: string;
  name: string;
  email: string;
  status: ProgressStatus;
  has_interacted: boolean;
}

export interface UseCasePeopleResult {
  recruited: UseCasePerson[];
  initiated: UseCasePerson[];
  witnessed: UseCasePerson[];
}

export async function fetchPeopleForUseCase(
  useCaseId: string,
  currentUserId: string
): Promise<UseCasePeopleResult> {
  // 1. Get all progress for this use case, excluding current user
  const { data: progressRows, error: progressError } = await supabase
    .from('user_progress_summary')
    .select('user_id, seen_at, done_at, share_count')
    .eq('use_case_id', useCaseId)
    .neq('user_id', currentUserId);

  if (progressError || !progressRows || progressRows.length === 0) {
    return { recruited: [], initiated: [], witnessed: [] };
  }

  const userIds = progressRows.map((r: any) => r.user_id);

  // 2. Get user details, excluding stub users
  const { data: users } = await supabase
    .from('users')
    .select('id, name, email, is_stub')
    .in('id', userIds)
    .eq('is_stub', false);

  if (!users || users.length === 0) {
    return { recruited: [], initiated: [], witnessed: [] };
  }

  const userMap = new Map(users.map((u: any) => [u.id, u]));

  // 3. Get share interactions involving current user
  const { data: shareInteractions } = await supabase
    .from('shares')
    .select('sharer_id, recipient_id')
    .or(`sharer_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
    .neq('status', 'denied');

  // 4. Get attribution interactions involving current user
  const { data: currentUserRow } = await supabase
    .from('users')
    .select('email')
    .eq('id', currentUserId)
    .single();

  const currentUserEmail = currentUserRow?.email || '';

  const { data: attributionInteractions } = await supabase
    .from('attributions')
    .select('learner_id, teacher_email')
    .or(`learner_id.eq.${currentUserId},teacher_email.eq.${currentUserEmail}`);

  // Build set of user IDs the current user has interacted with
  const interactedUserIds = new Set<string>();

  for (const s of shareInteractions || []) {
    if (s.sharer_id === currentUserId) interactedUserIds.add(s.recipient_id);
    if (s.recipient_id === currentUserId) interactedUserIds.add(s.sharer_id);
  }

  for (const a of attributionInteractions || []) {
    if (a.learner_id === currentUserId) {
      const teacher = users.find((u: any) => u.email === a.teacher_email);
      if (teacher) interactedUserIds.add(teacher.id);
    }
    if (a.teacher_email === currentUserEmail) {
      interactedUserIds.add(a.learner_id);
    }
  }

  // Classify into groups
  const recruited: UseCasePerson[] = [];
  const initiated: UseCasePerson[] = [];
  const witnessed: UseCasePerson[] = [];

  for (const row of progressRows) {
    const user = userMap.get(row.user_id);
    if (!user) continue;

    const person: UseCasePerson = {
      user_id: row.user_id,
      name: user.name,
      email: user.email,
      status: row.share_count >= 2 ? 'recruited' :
              row.done_at ? 'initiated' : 'witnessed',
      has_interacted: interactedUserIds.has(row.user_id),
    };

    if (person.status === 'recruited') recruited.push(person);
    else if (person.status === 'initiated') initiated.push(person);
    else witnessed.push(person);
  }

  // Sort: interacted first, then alphabetical
  const sortFn = (a: UseCasePerson, b: UseCasePerson) => {
    if (a.has_interacted !== b.has_interacted) {
      return a.has_interacted ? -1 : 1;
    }
    return (a.name || '').localeCompare(b.name || '');
  };

  recruited.sort(sortFn);
  initiated.sort(sortFn);
  witnessed.sort(sortFn);

  return { recruited, initiated, witnessed };
}
