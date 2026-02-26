import { supabase } from '../supabase';

export type TimelineEventType = 'learned' | 'applied' | 'shared' | 'submitted' | 'completed';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  use_case_title: string;
  use_case_id: string;
  timestamp: string;
  month: string;
}

export async function fetchUserTimeline(userId: string): Promise<TimelineEvent[]> {
  const events: TimelineEvent[] = [];

  // Get progress events
  const { data: progressData } = await supabase
    .from('user_progress_summary')
    .select('use_case_id, seen_at, done_at, is_completed, share_count')
    .eq('user_id', userId);

  // Get use case titles
  const useCaseIds = [...new Set((progressData || []).map((p: any) => p.use_case_id))];

  // Get submitted use cases
  const { data: submitted } = await supabase
    .from('use_cases')
    .select('id, title, created_at')
    .eq('submitted_by', userId);

  // Get shares
  const { data: shares } = await supabase
    .from('shares')
    .select('id, use_case_id, created_at')
    .eq('sharer_id', userId);

  // Get all referenced use case titles
  const allIds = [
    ...useCaseIds,
    ...(submitted || []).map((s: any) => s.id),
    ...(shares || []).map((s: any) => s.use_case_id),
  ];
  const { data: useCases } = allIds.length > 0
    ? await supabase.from('use_cases').select('id, title').in('id', [...new Set(allIds)])
    : { data: [] };
  const titleMap = new Map((useCases || []).map((uc: any) => [uc.id, uc.title]));

  // Progress events
  for (const p of progressData || []) {
    const title = titleMap.get(p.use_case_id) || 'Unknown';
    if (p.seen_at) {
      events.push({
        id: `learn-${p.use_case_id}`,
        type: 'learned',
        use_case_title: title,
        use_case_id: p.use_case_id,
        timestamp: p.seen_at,
        month: '',
      });
    }
    if (p.done_at) {
      events.push({
        id: `apply-${p.use_case_id}`,
        type: 'applied',
        use_case_title: title,
        use_case_id: p.use_case_id,
        timestamp: p.done_at,
        month: '',
      });
    }
    if (p.is_completed) {
      events.push({
        id: `complete-${p.use_case_id}`,
        type: 'completed',
        use_case_title: title,
        use_case_id: p.use_case_id,
        timestamp: p.done_at || p.seen_at,
        month: '',
      });
    }
  }

  // Submitted events
  for (const s of submitted || []) {
    events.push({
      id: `submit-${s.id}`,
      type: 'submitted',
      use_case_title: s.title,
      use_case_id: s.id,
      timestamp: s.created_at,
      month: '',
    });
  }

  // Share events
  for (const s of shares || []) {
    events.push({
      id: `share-${s.id}`,
      type: 'shared',
      use_case_title: titleMap.get(s.use_case_id) || 'Unknown',
      use_case_id: s.use_case_id,
      timestamp: s.created_at,
      month: '',
    });
  }

  // Sort by timestamp descending, limit to 100
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const limited = events.slice(0, 100);

  // Add month headers
  for (const event of limited) {
    const d = new Date(event.timestamp);
    event.month = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  return limited;
}
