-- Create profiles table
create table if not exists profiles (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    username text not null,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Add constraints
    constraint username_length check (char_length(username) >= 3)
);

-- Create indexes
create index if not exists profiles_user_id_idx on profiles(user_id);
create index if not exists profiles_username_idx on profiles(username);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Users can view their own profiles"
    on profiles for select
    using (auth.uid() = user_id);

create policy "Users can insert their own profiles"
    on profiles for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own profiles"
    on profiles for update
    using (auth.uid() = user_id); 