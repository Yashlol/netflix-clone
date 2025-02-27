import { supabase,ContinueWatching } from '../types/supabase';

export const continueWatchingService = {
  async getContinueWatching(userId: string, profileId: string): Promise<ContinueWatching[]> {
    const { data, error } = await supabase
      .from('continue_watching')
      .select('*')
      .eq('user_id', userId)
      .eq('profile_id', profileId)
      .order('last_watched', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateProgress(
    userId: string,
    profileId: string,
    movieId: number,
    progress: number
  ): Promise<ContinueWatching> {
    // Ensure progress is between 0 and 1
    const validProgress = Math.max(0, Math.min(1, progress));

    const { data: existing } = await supabase
      .from('continue_watching')
      .select('id')
      .eq('user_id', userId)
      .eq('profile_id', profileId)
      .eq('movie_id', movieId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('continue_watching')
        .update({
          progress: validProgress,
          last_watched: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('continue_watching')
        .insert([
          {
            user_id: userId,
            profile_id: profileId,
            movie_id: movieId,
            progress: validProgress,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  async removeFromContinueWatching(
    userId: string,
    profileId: string,
    movieId: number
  ): Promise<void> {
    const { error } = await supabase
      .from('continue_watching')
      .delete()
      .eq('user_id', userId)
      .eq('profile_id', profileId)
      .eq('movie_id', movieId);

    if (error) throw error;
  },

  async getProgress(userId: string, profileId: string, movieId: number): Promise<number> {
    const { data, error } = await supabase
      .from('continue_watching')
      .select('progress')
      .eq('user_id', userId)
      .eq('profile_id', profileId)
      .eq('movie_id', movieId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.progress || 0;
  },
}; 