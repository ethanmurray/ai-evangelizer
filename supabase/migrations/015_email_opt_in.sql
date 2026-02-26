-- Email opt-in preference: allows users to control whether they receive emails
-- Default true so existing users keep getting emails
ALTER TABLE users ADD COLUMN email_opt_in boolean DEFAULT true;
