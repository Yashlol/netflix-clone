import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Debug: Ensure environment variables are loaded
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("⚠️ Supabase environment variables are missing! Check your .env file.");
}

// Initialize Supabase client
export const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);

// Debug: Check session data
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error("🚨 Error fetching session:", error);
  } else {
    console.log("✅ Current session data:", data);
  }
});

// Alternative: Fetch user details instead of session
export const getUserProfile = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("🚨 Error fetching user:", error);
  }
  return data?.user || null;
};

// Type Definitions
export type Profile = {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
};

export type UserProfile = {
  id: string;
  email: string;
  profiles: Profile[];
};

export type WatchList = {
  id: string;
  user_id: string;
  profile_id: string;
  movie_id: number;
  added_at: string;
};

export type ContinueWatching = {
  id: string;
  user_id: string;
  profile_id: string;
  movie_id: number;
  progress: number;
  last_watched: string;
};

export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      watchlist: {
        Row: WatchList;
        Insert: Omit<WatchList, 'id' | 'added_at'>;
        Update: Partial<Omit<WatchList, 'id' | 'added_at'>>;
      };
      continue_watching: {
        Row: ContinueWatching;
        Insert: Omit<ContinueWatching, 'id' | 'last_watched'>;
        Update: Partial<Omit<ContinueWatching, 'id' | 'last_watched'>>;
      };
    };
  };
};
