import { supabase, WatchList } from '../types/supabase';

export const watchlistService = {
  /**
   * Get all movies in a user's watchlist
   */
  async getWatchlist(userId: string, profileId: string): Promise<WatchList[]> {
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)
      .eq('profile_id', profileId)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching watchlist:', error);
      throw new Error('Failed to fetch watchlist');
    }

    return data || [];
  },

  /**
   * Add a movie to the watchlist
   */
  async addToWatchlist(userId: string, profileId: string, movieId: number): Promise<WatchList> {
    // First check if the movie is already in the watchlist
    const { data: existing } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', userId)
      .eq('profile_id', profileId)
      .eq('movie_id', movieId)
      .single();

    if (existing) {
      throw new Error('Movie is already in watchlist');
    }

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

    if (error) {
      console.error('Error adding to watchlist:', error);
      throw new Error('Failed to add movie to watchlist');
    }

    return data;
  },

  /**
   * Remove a movie from the watchlist
   */
  async removeFromWatchlist(userId: string, profileId: string, movieId: number): Promise<void> {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('profile_id', profileId)
      .eq('movie_id', movieId);

    if (error) {
      console.error('Error removing from watchlist:', error);
      throw new Error('Failed to remove movie from watchlist');
    }
  },

  /**
   * Check if a movie is in the watchlist
   */
  async isInWatchlist(userId: string, profileId: string, movieId: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', userId)
      .eq('profile_id', profileId)
      .eq('movie_id', movieId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      console.error('Error checking watchlist:', error);
      throw new Error('Failed to check watchlist status');
    }

    return !!data;
  },

  /**
   * Get the total count of movies in the watchlist
   */
  async getWatchlistCount(userId: string, profileId: string): Promise<number> {
    const { count, error } = await supabase
      .from('watchlist')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('profile_id', profileId);

    if (error) {
      console.error('Error getting watchlist count:', error);
      throw new Error('Failed to get watchlist count');
    }

    return count || 0;
  },
}; 