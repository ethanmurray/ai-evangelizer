import { supabase } from '../supabase';

export interface OrgMetrics {
  totalUsers: number;
  totalPoints: number;
  totalUseCases: number;
  activeUsersLast7Days: number;
}

export interface InactiveUser {
  id: string;
  name: string;
  email: string;
  team: string;
  lastActivityAt: string | null;
}

export interface RecentSignup {
  id: string;
  name: string;
  email: string;
  team: string;
  createdAt: string;
}

export async function fetchOrgMetrics(): Promise<OrgMetrics> {
  const [usersRes, pointsRes, useCasesRes, activeRes] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('is_stub', false),
    supabase.from('user_total_points').select('total_points'),
    supabase.from('use_cases').select('id', { count: 'exact', head: true }),
    supabase
      .from('activity_events')
      .select('actor_id')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const totalPoints = (pointsRes.data || []).reduce(
    (sum: number, p: any) => sum + (p.total_points || 0),
    0
  );

  const activeUserIds = new Set((activeRes.data || []).map((e: any) => e.actor_id));

  return {
    totalUsers: usersRes.count || 0,
    totalPoints,
    totalUseCases: useCasesRes.count || 0,
    activeUsersLast7Days: activeUserIds.size,
  };
}

export async function fetchInactiveUsers(daysSince = 30): Promise<InactiveUser[]> {
  const cutoff = new Date(Date.now() - daysSince * 24 * 60 * 60 * 1000).toISOString();

  // Get all non-stub users
  const { data: users } = await supabase
    .from('users')
    .select('id, name, email, team')
    .eq('is_stub', false);

  if (!users || users.length === 0) return [];

  const userIds = users.map((u: any) => u.id);

  // Get most recent activity for each user
  const { data: events } = await supabase
    .from('activity_events')
    .select('actor_id, created_at')
    .in('actor_id', userIds)
    .order('created_at', { ascending: false });

  const lastActivityMap = new Map<string, string>();
  for (const e of events || []) {
    if (!lastActivityMap.has(e.actor_id)) {
      lastActivityMap.set(e.actor_id, e.created_at);
    }
  }

  return users
    .filter((u: any) => {
      const lastActivity = lastActivityMap.get(u.id);
      return !lastActivity || lastActivity < cutoff;
    })
    .map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      team: u.team,
      lastActivityAt: lastActivityMap.get(u.id) || null,
    }))
    .sort((a, b) => {
      if (!a.lastActivityAt && !b.lastActivityAt) return 0;
      if (!a.lastActivityAt) return -1;
      if (!b.lastActivityAt) return 1;
      return a.lastActivityAt.localeCompare(b.lastActivityAt);
    });
}

export async function fetchRecentSignups(days = 30): Promise<RecentSignup[]> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, team, created_at')
    .eq('is_stub', false)
    .gte('created_at', since)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    team: u.team,
    createdAt: u.created_at,
  }));
}

export async function exportUserDataCSV(): Promise<string> {
  const { data: users } = await supabase
    .from('users')
    .select('id, name, email, team, is_stub, is_admin, created_at')
    .eq('is_stub', false)
    .order('name');

  if (!users || users.length === 0) return '';

  const userIds = users.map((u: any) => u.id);

  const [pointsRes, progressRes] = await Promise.all([
    supabase.from('user_total_points').select('user_id, total_points').in('user_id', userIds),
    supabase
      .from('user_progress_summary')
      .select('user_id, seen_at, done_at, is_completed')
      .in('user_id', userIds),
  ]);

  const pointsMap = new Map(
    (pointsRes.data || []).map((p: any) => [p.user_id, p.total_points || 0])
  );

  const statsMap = new Map<string, { learned: number; applied: number; completed: number }>();
  for (const p of progressRes.data || []) {
    const s = statsMap.get(p.user_id) || { learned: 0, applied: 0, completed: 0 };
    if (p.seen_at) s.learned++;
    if (p.done_at) s.applied++;
    if (p.is_completed) s.completed++;
    statsMap.set(p.user_id, s);
  }

  const header = 'Name,Email,Team,Points,Learned,Applied,Completed,Admin,Joined';
  const rows = users.map((u: any) => {
    const s = statsMap.get(u.id) || { learned: 0, applied: 0, completed: 0 };
    const escapeCsv = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
    return [
      escapeCsv(u.name),
      escapeCsv(u.email),
      escapeCsv(u.team),
      pointsMap.get(u.id) || 0,
      s.learned,
      s.applied,
      s.completed,
      u.is_admin ? 'Yes' : 'No',
      u.created_at?.slice(0, 10) || '',
    ].join(',');
  });

  return [header, ...rows].join('\n');
}
