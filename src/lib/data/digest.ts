import { supabase } from '../supabase';
import { fetchTrendingUseCases, type TrendingUseCase } from './trending';

export interface DigestData {
  userName: string;
  userEmail: string;
  pointsThisWeek: number;
  totalPoints: number;
  newBadges: string[];
  teamRank: number | null;
  teamName: string;
  trending: TrendingUseCase[];
}

export async function fetchDigestDataForUser(userId: string): Promise<DigestData | null> {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Fetch user info
  const { data: user } = await supabase
    .from('users')
    .select('name, email, team')
    .eq('id', userId)
    .single();

  if (!user) return null;

  // Fetch total points
  const { data: pointsRow } = await supabase
    .from('user_total_points')
    .select('total_points')
    .eq('user_id', userId)
    .single();

  const totalPoints = pointsRow?.total_points || 0;

  // Estimate points earned this week from recent activity
  const { data: recentEvents } = await supabase
    .from('activity_events')
    .select('event_type')
    .eq('actor_id', userId)
    .gte('created_at', oneWeekAgo);

  let pointsThisWeek = 0;
  for (const e of recentEvents || []) {
    if (e.event_type === 'learned') pointsThisWeek += 5;
    else if (e.event_type === 'applied') pointsThisWeek += 10;
    else if (e.event_type === 'shared') pointsThisWeek += 15;
    else if (e.event_type === 'submitted') pointsThisWeek += 20;
  }

  // Fetch badges earned this week
  const { data: recentBadges } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId)
    .gte('earned_at', oneWeekAgo);

  const newBadges = (recentBadges || []).map((b: any) => b.badge_id);

  // Compute team rank
  let teamRank: number | null = null;
  if (user.team) {
    const { data: teamMembers } = await supabase
      .from('users')
      .select('id')
      .eq('team', user.team)
      .eq('is_stub', false);

    const memberIds = (teamMembers || []).map((u: any) => u.id);

    const { data: allPoints } = await supabase
      .from('user_total_points')
      .select('user_id, total_points')
      .in('user_id', memberIds)
      .order('total_points', { ascending: false });

    const idx = (allPoints || []).findIndex((p: any) => p.user_id === userId);
    if (idx !== -1) teamRank = idx + 1;
  }

  // Fetch trending
  const trending = await fetchTrendingUseCases(7, 3);

  return {
    userName: user.name,
    userEmail: user.email,
    pointsThisWeek,
    totalPoints,
    newBadges,
    teamRank,
    teamName: user.team,
    trending,
  };
}
