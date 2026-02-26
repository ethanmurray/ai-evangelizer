import { supabase } from '../supabase';

export type ActivityEventType =
  | 'learned'
  | 'applied'
  | 'shared'
  | 'submitted'
  | 'rank_up'
  | 'team_milestone';

export interface ActivityEvent {
  id: string;
  event_type: ActivityEventType;
  actor_id: string;
  use_case_id: string | null;
  team: string | null;
  metadata: Record<string, any>;
  created_at: string;
  actor_name?: string;
  use_case_title?: string;
}

export async function logActivity(
  eventType: ActivityEventType,
  actorId: string,
  useCaseId?: string,
  team?: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  await supabase.from('activity_events').insert({
    event_type: eventType,
    actor_id: actorId,
    use_case_id: useCaseId || null,
    team: team || null,
    metadata,
  });
}

export async function fetchActivityFeed(
  limit: number = 50,
  before?: string,
  teamFilter?: string
): Promise<ActivityEvent[]> {
  let query = supabase
    .from('activity_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (before) {
    query = query.lt('created_at', before);
  }

  if (teamFilter) {
    query = query.eq('team', teamFilter);
  }

  const { data: events, error } = await query;
  if (error || !events) return [];

  // Get unique actor IDs and use case IDs
  const actorIds = [...new Set(events.map((e: any) => e.actor_id).filter(Boolean))];
  const useCaseIds = [...new Set(events.map((e: any) => e.use_case_id).filter(Boolean))];

  // Fetch actor names
  const { data: users } = actorIds.length > 0
    ? await supabase.from('users').select('id, name').in('id', actorIds)
    : { data: [] };
  const userMap = new Map((users || []).map((u: any) => [u.id, u.name]));

  // Fetch use case titles
  const { data: useCases } = useCaseIds.length > 0
    ? await supabase.from('use_cases').select('id, title').in('id', useCaseIds)
    : { data: [] };
  const ucMap = new Map((useCases || []).map((uc: any) => [uc.id, uc.title]));

  return events.map((e: any) => ({
    ...e,
    actor_name: userMap.get(e.actor_id) || 'Someone',
    use_case_title: e.use_case_id ? ucMap.get(e.use_case_id) || 'a use case' : null,
  }));
}

export function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return new Date(dateStr).toLocaleDateString();
}
