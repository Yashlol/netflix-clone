# Supabase Setup for Netflix Clone

This directory contains all the necessary Supabase configurations and migrations for the Netflix Clone project.

## Directory Structure

```
supabase/
├── migrations/                 # Database migrations
│   ├── 20240318000000_create_extensions.sql
│   ├── 20240318000001_create_profiles_table.sql
│   ├── 20240318000002_create_watchlist_table.sql
│   └── 20240318000003_create_continue_watching_table.sql
├── config.toml                # Supabase configuration
├── seed.sql                   # Sample data for testing
└── README.md                  # This file
```

## Tables

### 1. profiles
- Stores user profile information
- Includes username and avatar
- Has RLS policies for security

### 2. watchlist
- Tracks movies added to user watchlists
- Links to profiles and movies
- Prevents duplicate entries

### 3. continue_watching
- Tracks movie watching progress
- Stores last watched timestamp
- Progress constrained between 0 and 1

## Setup Instructions

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Start Supabase locally:
```bash
supabase start
```

3. Apply migrations:
```bash
supabase db reset
```

4. Update seed.sql with your user ID:
- Create an account through the app
- Get your user ID from auth.users table
- Replace 'your-user-id' in seed.sql
- Run: `supabase db reset`

## Security

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- Email verification required for signup
- JWT expiry set to 1 hour

## Environment Variables

Make sure these variables are set in your .env file:
```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
```

## Common Issues

1. **Migration Errors**
   - Ensure migrations are in order
   - Check for existing tables before creating

2. **RLS Issues**
   - Verify user is authenticated
   - Check policy definitions

3. **Seed Data**
   - Update user_id in seed.sql
   - Run reset after updating

## Additional Resources

- [Supabase Documentation](https://supabase.io/docs)
- [Row Level Security](https://supabase.io/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.io/docs/guides/database/functions) 