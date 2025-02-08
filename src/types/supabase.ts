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