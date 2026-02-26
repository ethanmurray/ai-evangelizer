import { supabase } from '../supabase';

export interface DifficultyStats {
  use_case_id: string;
  avg_difficulty: number;
  rating_count: number;
}

export async function fetchDifficulty(useCaseId: string): Promise<DifficultyStats | null> {
  const { data, error } = await supabase
    .from('use_case_difficulty_stats')
    .select('*')
    .eq('use_case_id', useCaseId)
    .maybeSingle();

  if (error || !data) return null;
  return {
    use_case_id: data.use_case_id,
    avg_difficulty: parseFloat(data.avg_difficulty),
    rating_count: data.rating_count,
  };
}

export async function fetchAllDifficultyStats(): Promise<DifficultyStats[]> {
  const { data, error } = await supabase
    .from('use_case_difficulty_stats')
    .select('*');

  if (error || !data) return [];
  return data.map((d: any) => ({
    use_case_id: d.use_case_id,
    avg_difficulty: parseFloat(d.avg_difficulty),
    rating_count: d.rating_count,
  }));
}

export async function fetchUserRating(userId: string, useCaseId: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('difficulty_ratings')
    .select('rating')
    .eq('user_id', userId)
    .eq('use_case_id', useCaseId)
    .maybeSingle();

  if (error || !data) return null;
  return data.rating;
}

export async function rateDifficulty(userId: string, useCaseId: string, rating: number): Promise<void> {
  const { error } = await supabase
    .from('difficulty_ratings')
    .upsert(
      { user_id: userId, use_case_id: useCaseId, rating },
      { onConflict: 'user_id,use_case_id' }
    );

  if (error) throw new Error(error.message);
}
