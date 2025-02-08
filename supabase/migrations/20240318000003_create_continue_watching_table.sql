-- Create continue_watching table
create table if not exists continue_watching (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    profile_id uuid references profiles(id) not null,
    movie_id integer not null,
    progress float not null,
    last_watched timestamp with time zone default timezone('utc', now()) not null,
    -- Add constraint to ensure progress is between 0 and 1
    constraint progress_range check (progress >= 0 and progress <= 1)
);

-- Create indexes
create index if not exists continue_watching_user_id_idx on continue_watching(user_id);
create index if not exists continue_watching_profile_id_idx on continue_watching(profile_id);
create index if not exists continue_watching_movie_id_idx on continue_watching(movie_id);
create index if not exists continue_watching_last_watched_idx on continue_watching(last_watched desc);

-- Create unique constraint to prevent duplicate entries
create unique index if not exists continue_watching_unique_movie_idx 
    on continue_watching(user_id, profile_id, movie_id);

-- Enable RLS
alter table continue_watching enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their continue watching" on continue_watching;
drop policy if exists "Users can insert into continue watching" on continue_watching;
drop policy if exists "Users can update their continue watching" on continue_watching;

-- Create policies
create policy "Users can view their continue watching"
    on continue_watching for select
    using (auth.uid() = user_id);

create policy "Users can insert into continue watching"
    on continue_watching for insert
    with check (auth.uid() = user_id);

create policy "Users can update their continue watching"
    on continue_watching for update
    using (auth.uid() = user_id);

create unique index if not exists continue_watching_unique_movie_idx 
    on continue_watching(user_id, profile_id, movie_id);