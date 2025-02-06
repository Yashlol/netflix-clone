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