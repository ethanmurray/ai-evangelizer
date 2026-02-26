-- Add theme_preference column to users table
-- Supports all 8 content themes: cult, corporate, academic, startup, scifi, retro, nerdy, consulting
ALTER TABLE users ADD COLUMN IF NOT EXISTS theme_preference text;
