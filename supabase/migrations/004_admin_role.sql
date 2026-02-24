-- Add admin role to users table
ALTER TABLE users ADD COLUMN is_admin boolean DEFAULT false;

-- Then manually set yourself as admin:
-- UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
