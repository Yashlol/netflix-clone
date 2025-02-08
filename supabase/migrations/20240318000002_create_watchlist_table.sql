-- Create watchlist table
create table if not exists watchlist (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    profile_id uuid references profiles(id) not null,
    movie_id integer not null,
    added_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists watchlist_user_id_idx on watchlist(user_id);
create index if not exists watchlist_profile_id_idx on watchlist(profile_id);
create index if not exists watchlist_movie_id_idx on watchlist(movie_id);

-- Create unique constraint to prevent duplicate entries
create unique index if not exists watchlist_unique_movie_idx 
    on watchlist(user_id, profile_id, movie_id);

-- Enable RLS
alter table watchlist enable row level security;

-- Create policies
create policy "Users can view their own watchlist"
    on watchlist for select
    using (auth.uid() = user_id);

create policy "Users can insert into their own watchlist"
    on watchlist for insert
    with check (auth.uid() = user_id);

create policy "Users can delete from their own watchlist"
    on watchlist for delete
    using (auth.uid() = user_id); 