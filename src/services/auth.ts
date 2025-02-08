import { supabase } from '../lib/supabase';
import { UserProfile, Profile } from '../types/supabase';

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, username?: string): Promise<UserProfile | null> {
    try {
      // Check if email already exists
      const { data: existingEmail } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingEmail) {
        throw new Error('Email is already registered. Please login instead.');
      }

      // Check if username already exists
      const { data: existingUsername } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUsername) {
        throw new Error('Username is already taken. Please choose another one.');
      }

      // Proceed with signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
          },
          emailRedirectTo: window.location.origin,
        }
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          throw new Error('This email is already registered. Please login instead.');
        }
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Failed to create account');
      }

      try {
        // Create initial profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: authData.user.id,
              email: email,
              username: username || email.split('@')[0],
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (profileError) {
          // If profile creation fails, attempt to clean up the auth user
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw new Error('Failed to create profile. Please try again.');
        }

        return {
          id: authData.user.id,
          email: authData.user.email!,
          profiles: [profileData as Profile],
        };
      } catch (error) {
        // If anything fails during profile creation, clean up the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw error;
      }
    } catch (error: any) {
      // Properly format and throw all errors
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('Failed to create account. Please try again.');
    }
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
    // Check if user has reached the maximum number of profiles (3)
    const { data: existingProfiles, error: countError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId);

    if (countError) throw new Error(countError.message);
    if (existingProfiles.length >= 3) {
      throw new Error('Maximum number of profiles (3) reached');
    }

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

  // Resend verification email
  async resendVerificationEmail(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    
    if (error) throw new Error(error.message);
  },
}; 