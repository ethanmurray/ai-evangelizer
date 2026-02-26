-- Add theme_preference column to users table
-- Supports all 8 content themes: cult, corporate, academic, startup, scifi, retro, nerdy, consulting
ALTER TABLE users ADD COLUMN IF NOT EXISTS theme_preference text;

-- Drop the old CHECK constraint that only allowed cult/corporate
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_theme_preference_check;

-- Add CHECK constraint allowing all 8 themes
ALTER TABLE users ADD CONSTRAINT users_theme_preference_check
  CHECK (theme_preference IS NULL OR theme_preference IN (
    'cult', 'corporate', 'academic', 'startup', 'scifi', 'retro', 'nerdy', 'consulting'
  ));
