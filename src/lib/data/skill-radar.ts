import { supabase } from '../supabase';

const LABEL_GROUPS: Record<string, string[]> = {
  'Coding': ['Coding', 'Code Generation', 'Code Quality'],
  'Testing & Debug': ['Testing', 'Debugging'],
  'Writing & Docs': ['Documentation', 'Writing', 'Text Processing'],
  'Data': ['Data', 'SQL'],
  'DevOps': ['DevOps', 'Git', 'Automation'],
  'APIs & Frameworks': ['APIs', 'Frameworks', 'Learning'],
};

export interface SkillRadarPoint {
  label: string;
  score: number;
  learnedCount: number;
  appliedCount: number;
  sharedCount: number;
  totalUseCases: number;
}

export async function fetchSkillRadar(userId: string): Promise<SkillRadarPoint[]> {
  // Get user progress
  const { data: progressData } = await supabase
    .from('user_progress_summary')
    .select('use_case_id, seen_at, done_at, share_count')
    .eq('user_id', userId);

  const progressRows = progressData || [];
  const useCaseIds = progressRows.map((r: any) => r.use_case_id);

  // Get all use cases with labels
  const { data: allUseCases } = await supabase
    .from('use_cases')
    .select('id, labels');

  const ucMap = new Map((allUseCases || []).map((uc: any) => [uc.id, uc.labels || []]));
  const progressMap = new Map(progressRows.map((r: any) => [r.use_case_id, r]));

  return Object.entries(LABEL_GROUPS).map(([groupName, labels]) => {
    // Find use cases that belong to this group
    const groupUseCaseIds = (allUseCases || [])
      .filter((uc: any) => (uc.labels || []).some((l: string) => labels.includes(l)))
      .map((uc: any) => uc.id);

    const totalUseCases = groupUseCaseIds.length;

    let learnedCount = 0;
    let appliedCount = 0;
    let sharedCount = 0;

    for (const ucId of groupUseCaseIds) {
      const p = progressMap.get(ucId);
      if (p) {
        if (p.seen_at) learnedCount++;
        if (p.done_at) appliedCount++;
        sharedCount += p.share_count || 0;
      }
    }

    // Score: weighted combination (learned=1, applied=3, shared=6) / (totalUseCases * 10) * 100
    const points = learnedCount * 1 + appliedCount * 3 + sharedCount * 6;
    const maxPoints = totalUseCases > 0 ? totalUseCases * 10 : 1;
    const score = Math.min(100, Math.round((points / maxPoints) * 100));

    return {
      label: groupName,
      score: totalUseCases > 0 ? score : 0,
      learnedCount,
      appliedCount,
      sharedCount,
      totalUseCases,
    };
  });
}
