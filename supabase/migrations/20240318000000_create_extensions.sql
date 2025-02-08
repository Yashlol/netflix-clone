-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Enable pgcrypto for password hashing
create extension if not exists "pgcrypto"; 