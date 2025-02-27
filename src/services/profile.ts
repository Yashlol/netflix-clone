import { supabase, Profile } from '../types/supabase';

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async createProfile(userId: string, username: string, avatarUrl?: string): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: userId,
          username,
          avatar_url: avatarUrl,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(
    userId: string,
    updates: { username?: string; avatar_url?: string }
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProfile(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  },
}; 