import { supabase } from '../supabase';

export interface LevelPrize {
  id: string;
  user_id: string;
  rank_name: string;
  rank_min_points: number;
  created_at: string;
  fulfilled_at: string | null;
}

/**
 * Fetch all level prizes for a user.
 */
export async function fetchUserLevelPrizes(userId: string): Promise<LevelPrize[]> {
  const { data } = await supabase
    .from('level_prizes')
    .select('*')
    .eq('user_id', userId)
    .order('rank_min_points', { ascending: true });

  return (data || []) as LevelPrize[];
}

/**
 * Record a new level prize when user reaches a new rank.
 * Returns the created prize, or null if it already exists.
 */
export async function recordLevelPrize(
  userId: string,
  rankName: string,
  rankMinPoints: number
): Promise<LevelPrize | null> {
  const { data, error } = await supabase
    .from('level_prizes')
    .upsert(
      {
        user_id: userId,
        rank_name: rankName,
        rank_min_points: rankMinPoints,
      },
      { onConflict: 'user_id,rank_min_points' }
    )
    .select()
    .single();

  if (error) return null;
  return data as LevelPrize;
}

/**
 * Fetch the user's shipping address.
 */
export async function fetchShippingAddress(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('users')
    .select('shipping_address')
    .eq('id', userId)
    .single();

  return data?.shipping_address || null;
}

/**
 * Update the user's shipping address.
 */
export async function updateShippingAddress(
  userId: string,
  address: string
): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update({ shipping_address: address })
    .eq('id', userId);

  return !error;
}

/**
 * Admin: Fetch all unfulfilled level prizes with user info.
 */
export interface PrizeFulfillmentEntry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  shippingAddress: string | null;
  rankName: string;
  rankMinPoints: number;
  createdAt: string;
  fulfilledAt: string | null;
}

export async function fetchUnfulfilledPrizes(): Promise<PrizeFulfillmentEntry[]> {
  const { data: prizes } = await supabase
    .from('level_prizes')
    .select('*')
    .is('fulfilled_at', null)
    .order('created_at', { ascending: true });

  if (!prizes || prizes.length === 0) return [];

  const userIds = [...new Set(prizes.map((p: any) => p.user_id))];
  const { data: users } = await supabase
    .from('users')
    .select('id, name, email, shipping_address')
    .in('id', userIds);

  const userMap = new Map(
    (users || []).map((u: any) => [u.id, u])
  );

  return prizes.map((p: any) => {
    const user = userMap.get(p.user_id) || {};
    return {
      id: p.id,
      userId: p.user_id,
      userName: (user as any).name || 'Unknown',
      userEmail: (user as any).email || '',
      shippingAddress: (user as any).shipping_address || null,
      rankName: p.rank_name,
      rankMinPoints: p.rank_min_points,
      createdAt: p.created_at,
      fulfilledAt: p.fulfilled_at,
    };
  });
}

/**
 * Admin: Fetch all level prizes (including fulfilled) with user info.
 */
export async function fetchAllPrizes(): Promise<PrizeFulfillmentEntry[]> {
  const { data: prizes } = await supabase
    .from('level_prizes')
    .select('*')
    .order('created_at', { ascending: false });

  if (!prizes || prizes.length === 0) return [];

  const userIds = [...new Set(prizes.map((p: any) => p.user_id))];
  const { data: users } = await supabase
    .from('users')
    .select('id, name, email, shipping_address')
    .in('id', userIds);

  const userMap = new Map(
    (users || []).map((u: any) => [u.id, u])
  );

  return prizes.map((p: any) => {
    const user = userMap.get(p.user_id) || {};
    return {
      id: p.id,
      userId: p.user_id,
      userName: (user as any).name || 'Unknown',
      userEmail: (user as any).email || '',
      shippingAddress: (user as any).shipping_address || null,
      rankName: p.rank_name,
      rankMinPoints: p.rank_min_points,
      createdAt: p.created_at,
      fulfilledAt: p.fulfilled_at,
    };
  });
}

/**
 * Admin: Mark a prize as fulfilled.
 */
export async function fulfillPrize(prizeId: string): Promise<boolean> {
  const { error } = await supabase
    .from('level_prizes')
    .update({ fulfilled_at: new Date().toISOString() })
    .eq('id', prizeId);

  return !error;
}
