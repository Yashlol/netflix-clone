-- Seed data for testing purposes
-- Note: These inserts will only work after creating a user through the auth system
-- Replace 'your-user-id' with an actual user ID from auth.users

-- Insert sample profiles
insert into profiles (user_id, username, avatar_url)
values 
    ('your-user-id', 'testuser1', 'https://example.com/avatar1.jpg'),
    ('your-user-id', 'testuser2', 'https://example.com/avatar2.jpg');

-- Insert sample watchlist items
insert into watchlist (user_id, profile_id, movie_id)
values 
    ('your-user-id', (select id from profiles where username = 'testuser1'), 550),
    ('your-user-id', (select id from profiles where username = 'testuser1'), 551),
    ('your-user-id', (select id from profiles where username = 'testuser2'), 552);

-- Insert sample continue watching items
insert into continue_watching (user_id, profile_id, movie_id, progress)
values 
    ('your-user-id', (select id from profiles where username = 'testuser1'), 550, 0.5),
    ('your-user-id', (select id from profiles where username = 'testuser1'), 551, 0.75),
    ('your-user-id', (select id from profiles where username = 'testuser2'), 552, 0.25); 