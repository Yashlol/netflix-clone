-------------------------------------------------
-- Create the watchlist table
-------------------------------------------------
CREATE TABLE IF NOT EXISTS watchlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    movie_id INTEGER NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for watchlist
CREATE INDEX IF NOT EXISTS watchlist_user_id_idx ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS watchlist_profile_id_idx ON watchlist(profile_id);
CREATE INDEX IF NOT EXISTS watchlist_movie_id_idx ON watchlist(movie_id);

-- Create a unique index to prevent duplicate watchlist entries
CREATE UNIQUE INDEX IF NOT EXISTS watchlist_unique_movie_idx 
    ON watchlist(user_id, profile_id, movie_id);

-- Enable Row Level Security (RLS) for watchlist
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for watchlist (if any)
DROP POLICY IF EXISTS "Users can view their own watchlist" ON watchlist;
DROP POLICY IF EXISTS "Users can insert into their own watchlist" ON watchlist;
DROP POLICY IF EXISTS "Users can delete from their own watchlist" ON watchlist;

-- Create RLS policies for watchlist
CREATE POLICY "Users can view their own watchlist"
    ON watchlist FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own watchlist"
    ON watchlist FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watchlist"
    ON watchlist FOR DELETE
    USING (auth.uid() = user_id);
