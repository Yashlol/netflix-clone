import { supabase } from '../lib/supabase';
import { WatchList } from '../types/supabase';

export const watchlistService = {
  async getWatchlist(userId: string, profileId: string): Promise<WatchList[]> {
    try {
      console.log('Getting watchlist for user:', userId, 'profile:', profileId);
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', userId)
        .eq('profile_id', profileId);

      if (error) {
        console.error('Supabase error fetching watchlist:', error);
        throw error;
      }

      console.log('Watchlist data from DB:', data);
      return data || [];
    } catch (error) {
      console.error('Error in getWatchlist:', error);
      throw error;
    }
  },

  async addToWatchlist(userId: string, profileId: string, movieId: number): Promise<WatchList> {
    try {
      console.log('Adding to watchlist:', { userId, profileId, movieId });
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
        console.error('Supabase error adding to watchlist:', error);
        throw error;
      }

      console.log('Successfully added to watchlist:', data);
      return data;
    } catch (error) {
      console.error('Error in addToWatchlist:', error);
      throw error;
    }
  },

  async removeFromWatchlist(userId: string, profileId: string, movieId: number): Promise<void> {
    try {
      console.log('Removing from watchlist:', { userId, profileId, movieId });
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', userId)
        .eq('profile_id', profileId)
        .eq('movie_id', movieId);

      if (error) {
        console.error('Supabase error removing from watchlist:', error);
        throw error;
      }

      console.log('Successfully removed from watchlist');
    } catch (error) {
      console.error('Error in removeFromWatchlist:', error);
      throw error;
    }
  },

  async isInWatchlist(userId: string, profileId: string, movieId: number): Promise<boolean> {
    try {
      console.log('Checking if movie is in watchlist:', { userId, profileId, movieId });
      const { data, error } = await supabase
        .from('watchlist')
        .select('id')
        .eq('user_id', userId)
        .eq('profile_id', profileId)
        .eq('movie_id', movieId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase error checking watchlist:', error);
        throw error;
      }

      const isInList = !!data;
      console.log('Is movie in watchlist:', isInList);
      return isInList;
    } catch (error) {
      console.error('Error in isInWatchlist:', error);
      throw error;
    }
  },
}; 