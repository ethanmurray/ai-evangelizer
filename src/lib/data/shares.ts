import { supabase } from '../supabase';

export interface ShareRecord {
  id: string;
  sharer_id: string;
  recipient_id: string;
  use_case_id: string;
  status: string;
  created_at: string;
  sharer_name?: string;
  recipient_name?: string;
  use_case_title?: string;
}

export async function fetchUserShares(userId: string): Promise<ShareRecord[]> {
  const { data, error } = await supabase
    .from('shares')
    .select(`
      id, sharer_id, recipient_id, use_case_id, status, created_at,
      recipient:users!shares_recipient_id_fkey(name),
      use_case:use_cases!shares_use_case_id_fkey(title)
    `)
    .eq('sharer_id', userId)
    .neq('status', 'denied')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((s: any) => ({
    id: s.id,
    sharer_id: s.sharer_id,
    recipient_id: s.recipient_id,
    use_case_id: s.use_case_id,
    status: s.status,
    created_at: s.created_at,
    recipient_name: s.recipient?.name,
    use_case_title: s.use_case?.title,
  }));
}

export async function fetchUserReceivedShares(userId: string): Promise<ShareRecord[]> {
  const { data, error } = await supabase
    .from('shares')
    .select(`
      id, sharer_id, recipient_id, use_case_id, status, created_at,
      sharer:users!shares_sharer_id_fkey(name),
      use_case:use_cases!shares_use_case_id_fkey(title)
    `)
    .eq('recipient_id', userId)
    .neq('status', 'denied')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((s: any) => ({
    id: s.id,
    sharer_id: s.sharer_id,
    recipient_id: s.recipient_id,
    use_case_id: s.use_case_id,
    status: s.status,
    created_at: s.created_at,
    sharer_name: s.sharer?.name,
    use_case_title: s.use_case?.title,
  }));
}
