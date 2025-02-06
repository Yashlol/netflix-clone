import { supabase } from '../lib/supabase';
import { UserProfile, Profile } from '../types/supabase';

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string): Promise<UserProfile | null> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) return null;

    // Create initial profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: authData.user.id,
          username: email.split('@')[0],
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (profileError) throw new Error(profileError.message);

    return {
      id: authData.user.id,
      email: authData.user.email!,
      profiles: [profileData as Profile],
    };
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return user;
  },

  // Get user profiles
  async getUserProfiles(userId: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return data as Profile[];
  },

  // Create new profile
  async createProfile(userId: string, username: string, avatarUrl?: string): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: userId,
          username,
          avatar_url: avatarUrl,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Profile;
  },
}; 