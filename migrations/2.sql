-- Migration 2: Add role to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'student';

-- Add check constraint for valid roles
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'warden', 'admin'));
