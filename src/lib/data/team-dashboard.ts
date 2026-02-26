import { supabase } from '../supabase';
import { PREDEFINED_LABELS } from './use-cases';

export interface TeamOverview {
  totalMembers: number;
  totalPoints: number;
  totalLearned: number;
  totalApplied: number;
  totalCompleted: number;
}

export interface TeamMember {
  user_id: string;
  name: string;
  email: string;
  points: number;
  learned_count: number;
  applied_count: number;
  completed_count: number;
}

export interface WeeklyGrowth {
  week: string;
  learned: number;
  applied: number;
}

export interface SkillGap {
  label: string;
  adoptionPercent: number;
  membersWithSkill: number;
  totalMembers: number;
  isGap: boolean;
}

export interface UseCaseAdoption {
  id: string;
  title: string;
  learnedCount: number;
  appliedCount: number;
  completedCount: number;
  teamMemberCount: number;
}

export async function fetchTeamOverview(team: string): Promise<TeamOverview> {
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .eq('team', team)
    .eq('is_stub', false);

  const memberIds = (users || []).map((u: any) => u.id);
  if (memberIds.length === 0) {
    return { totalMembers: 0, totalPoints: 0, totalLearned: 0, totalApplied: 0, totalCompleted: 0 };
  }

  const { data: points } = await supabase
    .from('user_total_points')
    .select('total_points')
    .in('user_id', memberIds);

  const { data: progress } = await supabase
    .from('user_progress_summary')
    .select('seen_at, done_at, is_completed')
    .in('user_id', memberIds);

  let totalLearned = 0, totalApplied = 0, totalCompleted = 0;
  for (const p of progress || []) {
    if (p.seen_at) totalLearned++;
    if (p.done_at) totalApplied++;
    if (p.is_completed) totalCompleted++;
  }

  return {
    totalMembers: memberIds.length,
    totalPoints: (points || []).reduce((sum: number, p: any) => sum + (p.total_points || 0), 0),
    totalLearned,
    totalApplied,
    totalCompleted,
  };
}

export async function fetchTeamMembers(team: string): Promise<TeamMember[]> {
  const { data: users } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('team', team)
    .eq('is_stub', false);

  if (!users || users.length === 0) return [];

  const memberIds = users.map((u: any) => u.id);

  const { data: points } = await supabase
    .from('user_total_points')
    .select('user_id, total_points')
    .in('user_id', memberIds);

  const { data: progress } = await supabase
    .from('user_progress_summary')
    .select('user_id, seen_at, done_at, is_completed')
    .in('user_id', memberIds);

  const pointsMap = new Map((points || []).map((p: any) => [p.user_id, p.total_points || 0]));

  const statsMap = new Map<string, { learned: number; applied: number; completed: number }>();
  for (const p of progress || []) {
    const s = statsMap.get(p.user_id) || { learned: 0, applied: 0, completed: 0 };
    if (p.seen_at) s.learned++;
    if (p.done_at) s.applied++;
    if (p.is_completed) s.completed++;
    statsMap.set(p.user_id, s);
  }

  return users.map((u: any) => {
    const s = statsMap.get(u.id) || { learned: 0, applied: 0, completed: 0 };
    return {
      user_id: u.id,
      name: u.name,
      email: u.email,
      points: pointsMap.get(u.id) || 0,
      learned_count: s.learned,
      applied_count: s.applied,
      completed_count: s.completed,
    };
  }).sort((a, b) => b.points - a.points);
}

export async function fetchTeamWeeklyGrowth(team: string, weeks = 8): Promise<WeeklyGrowth[]> {
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .eq('team', team)
    .eq('is_stub', false);

  const memberIds = (users || []).map((u: any) => u.id);
  if (memberIds.length === 0) return [];

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - weeks * 7);

  const { data: progress } = await supabase
    .from('user_progress_summary')
    .select('seen_at, done_at')
    .in('user_id', memberIds);

  // Group by week
  const weekMap = new Map<string, { learned: number; applied: number }>();

  for (const p of progress || []) {
    if (p.seen_at) {
      const d = new Date(p.seen_at);
      if (d >= sinceDate) {
        const weekStart = getWeekStart(d);
        const w = weekMap.get(weekStart) || { learned: 0, applied: 0 };
        w.learned++;
        weekMap.set(weekStart, w);
      }
    }
    if (p.done_at) {
      const d = new Date(p.done_at);
      if (d >= sinceDate) {
        const weekStart = getWeekStart(d);
        const w = weekMap.get(weekStart) || { learned: 0, applied: 0 };
        w.applied++;
        weekMap.set(weekStart, w);
      }
    }
  }

  // Generate all weeks
  const result: WeeklyGrowth[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    const weekStart = getWeekStart(d);
    const data = weekMap.get(weekStart) || { learned: 0, applied: 0 };
    result.push({ week: weekStart, ...data });
  }

  return result;
}

export async function fetchTeamSkillGaps(team: string): Promise<SkillGap[]> {
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .eq('team', team)
    .eq('is_stub', false);

  const memberIds = (users || []).map((u: any) => u.id);
  if (memberIds.length === 0) return [];

  // Get all progress with use case labels
  const { data: progress } = await supabase
    .from('user_progress_summary')
    .select('user_id, use_case_id, seen_at')
    .in('user_id', memberIds);

  // Get use case labels
  const useCaseIds = [...new Set((progress || []).map((p: any) => p.use_case_id))];
  const { data: useCases } = useCaseIds.length > 0
    ? await supabase.from('use_cases').select('id, labels').in('id', useCaseIds)
    : { data: [] };

  const labelMap = new Map<string, string[]>((useCases || []).map((uc: any) => [uc.id, uc.labels || []]));

  // For each label, count unique team members who have learned at least 1 use case with that label
  const labelUserSets = new Map<string, Set<string>>();
  for (const label of PREDEFINED_LABELS) {
    labelUserSets.set(label, new Set());
  }

  for (const p of progress || []) {
    if (!p.seen_at) continue;
    const labels = labelMap.get(p.use_case_id) || [];
    for (const label of labels) {
      const s = labelUserSets.get(label);
      if (s) s.add(p.user_id);
    }
  }

  const totalMembers = memberIds.length;
  return PREDEFINED_LABELS.map((label) => {
    const membersWithSkill = labelUserSets.get(label)?.size || 0;
    const adoptionPercent = Math.round((membersWithSkill / totalMembers) * 100);
    return {
      label,
      adoptionPercent,
      membersWithSkill,
      totalMembers,
      isGap: adoptionPercent < 30,
    };
  }).sort((a, b) => a.adoptionPercent - b.adoptionPercent);
}

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}
