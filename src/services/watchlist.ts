import { supabase } from '../lib/supabase';
import { WatchList } from '../types/supabase';

export const watchlistService = {
  async getWatchlist(userId: string, profileId: string): Promise<WatchList[]> {
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)
      .eq('profile_id', profileId);

    if (error) throw error;
    return data || [];
  },

  async addToWatchlist(userId: string, profileId: string, movieId: number): Promise<WatchList> {
    const { data, error } = await supabase
      .from('watchlist')
      .insert([
        {
          user_id: userId,
          profile_id: profileId,
          movie_id: movieId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFromWatchlist(userId: string, profileId: string, movieId: number): Promise<void> {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('profile_id', profileId)
      .eq('movie_id', movieId);

    if (error) throw error;
  },

  async isInWatchlist(userId: string, profileId: string, movieId: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', userId)
      .eq('profile_id', profileId)
      .eq('movie_id', movieId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },
}; 