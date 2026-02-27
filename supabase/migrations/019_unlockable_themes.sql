-- Add new unlockable themes to the theme_preference CHECK constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_theme_preference_check;

ALTER TABLE users ADD CONSTRAINT users_theme_preference_check
  CHECK (theme_preference IS NULL OR theme_preference IN (
    'cult', 'corporate', 'academic', 'startup', 'scifi', 'retro', 'nerdy', 'consulting',
    'pirate', 'noir', 'medieval'
  ));
