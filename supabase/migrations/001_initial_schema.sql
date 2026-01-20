-- Initial schema for AI Evangelizer Leaderboard
-- Designed for future authentication system migrations

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table (future-compatible with auth systems)
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_provider text NOT NULL DEFAULT 'simple' CHECK (auth_provider IN ('simple', 'supabase', 'okta')),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  external_auth_id text NULL, -- References auth.users.id (Supabase) or Okta user ID
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_auth_provider ON user_profiles(auth_provider);
CREATE INDEX idx_user_profiles_external_auth_id ON user_profiles(external_auth_id) WHERE external_auth_id IS NOT NULL;
CREATE INDEX idx_user_profiles_active ON user_profiles(is_active) WHERE is_active = true;

-- Add email validation constraint
ALTER TABLE user_profiles
ADD CONSTRAINT valid_email
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Add name validation constraints
ALTER TABLE user_profiles
ADD CONSTRAINT valid_first_name
CHECK (length(trim(first_name)) >= 1 AND length(trim(first_name)) <= 50);

ALTER TABLE user_profiles
ADD CONSTRAINT valid_last_name
CHECK (length(trim(last_name)) >= 1 AND length(trim(last_name)) <= 50);

-- Create badges table
CREATE TABLE badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon_url text,
  points integer DEFAULT 0,
  category text NOT NULL DEFAULT 'general',
  requirements jsonb, -- Flexible requirements definition
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for badges
CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badges_active ON badges(is_active) WHERE is_active = true;
CREATE INDEX idx_badges_points ON badges(points DESC);

-- Add badge requirements validation
ALTER TABLE badges
ADD CONSTRAINT valid_requirements
CHECK (requirements IS NULL OR jsonb_typeof(requirements) = 'object');

-- Create user_badges junction table
CREATE TABLE user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at timestamptz DEFAULT now(),
  awarded_by uuid REFERENCES user_profiles(id), -- Optional: who awarded the badge
  notes text, -- Optional context for the award

  UNIQUE(user_id, badge_id) -- Prevent duplicate badges
);

-- Create indexes for user_badges
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX idx_user_badges_awarded_at ON user_badges(awarded_at);

-- Create leaderboard_entries table (computed/cached rankings)
CREATE TABLE leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  total_points integer DEFAULT 0,
  badge_count integer DEFAULT 0,
  rank_position integer,
  last_calculated timestamptz DEFAULT now(),

  UNIQUE(user_id)
);

-- Create indexes for leaderboard
CREATE INDEX idx_leaderboard_rank ON leaderboard_entries(rank_position);
CREATE INDEX idx_leaderboard_points ON leaderboard_entries(total_points DESC);
CREATE INDEX idx_leaderboard_calculated ON leaderboard_entries(last_calculated);

-- Create view for leaderboard display
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
  up.id,
  up.first_name,
  up.last_name,
  up.email,
  COALESCE(le.total_points, 0) as total_points,
  COALESCE(le.badge_count, 0) as badge_count,
  COALESCE(le.rank_position, 999999) as rank_position,
  up.last_seen
FROM user_profiles up
LEFT JOIN leaderboard_entries le ON up.id = le.user_id
WHERE up.is_active = true
ORDER BY le.rank_position NULLS LAST, up.created_at;

-- Create view for user badge summary
CREATE OR REPLACE VIEW user_badge_summary AS
SELECT
  up.id as user_id,
  up.first_name,
  up.last_name,
  up.email,
  COUNT(ub.badge_id) as total_badges,
  COALESCE(SUM(b.points), 0) as total_points,
  array_agg(
    json_build_object(
      'name', b.name,
      'icon_url', b.icon_url,
      'points', b.points,
      'awarded_at', ub.awarded_at
    ) ORDER BY ub.awarded_at DESC
  ) FILTER (WHERE b.id IS NOT NULL) as recent_badges
FROM user_profiles up
LEFT JOIN user_badges ub ON up.id = ub.user_id
LEFT JOIN badges b ON ub.badge_id = b.id AND b.is_active = true
WHERE up.is_active = true
GROUP BY up.id, up.first_name, up.last_name, up.email;

-- Create function to update leaderboard rankings
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  -- Update or insert leaderboard entries
  INSERT INTO leaderboard_entries (user_id, total_points, badge_count, rank_position, last_calculated)
  SELECT
    ubs.user_id,
    ubs.total_points,
    ubs.total_badges,
    RANK() OVER (ORDER BY ubs.total_points DESC, ubs.total_badges DESC, up.created_at),
    now()
  FROM user_badge_summary ubs
  JOIN user_profiles up ON ubs.user_id = up.id
  WHERE up.is_active = true
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = EXCLUDED.total_points,
    badge_count = EXCLUDED.badge_count,
    rank_position = EXCLUDED.rank_position,
    last_calculated = EXCLUDED.last_calculated;

  -- Remove entries for inactive users
  DELETE FROM leaderboard_entries
  WHERE user_id IN (
    SELECT id FROM user_profiles WHERE is_active = false
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to update user timestamps
CREATE OR REPLACE FUNCTION update_user_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_profiles_timestamp
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_timestamp();

CREATE TRIGGER update_badges_timestamp
  BEFORE UPDATE ON badges
  FOR EACH ROW
  EXECUTE FUNCTION update_user_timestamp();

-- Create function to automatically refresh leaderboard on badge changes
CREATE OR REPLACE FUNCTION refresh_leaderboard_on_badge_change()
RETURNS trigger AS $$
BEGIN
  -- Refresh leaderboard when badges are awarded or removed
  PERFORM refresh_leaderboard();
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-refresh leaderboard
CREATE TRIGGER auto_refresh_leaderboard
  AFTER INSERT OR DELETE ON user_badges
  FOR EACH ROW
  EXECUTE FUNCTION refresh_leaderboard_on_badge_change();

-- Enable Row Level Security (RLS) for future auth integration
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for Phase 1 (simple auth)
-- These will be updated during auth system migrations

-- Allow all users to read profiles and leaderboard (public leaderboard)
CREATE POLICY "Allow read access to user profiles" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow read access to badges" ON badges
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow read access to user badges" ON user_badges
  FOR SELECT USING (true);

CREATE POLICY "Allow read access to leaderboard" ON leaderboard_entries
  FOR SELECT USING (true);

-- More restrictive write policies will be added based on auth provider
-- For now, allow all operations (will be restricted in application logic)
CREATE POLICY "Allow insert user profiles" ON user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update own user profile" ON user_profiles
  FOR UPDATE USING (true); -- Will be restricted to current user in Phase 2+

-- Insert some sample badges for testing
INSERT INTO badges (name, description, icon_url, points, category, requirements) VALUES
  ('Early Adopter', 'One of the first users to join the platform', '🚀', 10, 'milestone', '{"type": "registration_order", "max_users": 100}'),
  ('First Badge', 'Earned your very first badge', '🎖️', 5, 'achievement', '{"type": "badge_count", "min_badges": 1}'),
  ('Social Butterfly', 'Connected with multiple team members', '🦋', 15, 'social', '{"type": "connections", "min_connections": 5}'),
  ('Knowledge Seeker', 'Completed learning modules', '📚', 20, 'learning', '{"type": "modules_completed", "min_modules": 3}'),
  ('Team Player', 'Collaborated on group projects', '🤝', 25, 'collaboration', '{"type": "group_projects", "min_projects": 2}'),
  ('Innovation Leader', 'Contributed innovative ideas', '💡', 30, 'leadership', '{"type": "ideas_submitted", "min_ideas": 5}'),
  ('Mentor', 'Helped onboard new team members', '👨‍🏫', 40, 'leadership', '{"type": "mentorship_sessions", "min_sessions": 3}'),
  ('AI Evangelist', 'Promoted AI adoption across the organization', '🤖', 50, 'evangelism', '{"type": "ai_presentations", "min_presentations": 3}');

-- Create comment explaining the schema design
COMMENT ON TABLE user_profiles IS 'User profiles designed for multi-provider authentication. The auth_provider field tracks which system created the user, and external_auth_id links to external auth systems during migrations.';
COMMENT ON COLUMN user_profiles.auth_provider IS 'Tracks authentication provider: simple (Phase 1), supabase (Phase 2), okta (Phase 3)';
COMMENT ON COLUMN user_profiles.external_auth_id IS 'References auth.users.id for Supabase or Okta user ID for enterprise auth';
COMMENT ON TABLE badges IS 'Badge definitions with flexible JSON requirements for complex achievement logic';
COMMENT ON COLUMN badges.requirements IS 'JSON object defining badge requirements, allows for complex achievement logic';
COMMENT ON TABLE user_badges IS 'Junction table tracking which users have earned which badges';
COMMENT ON TABLE leaderboard_entries IS 'Cached leaderboard rankings for performance, refreshed automatically';
COMMENT ON FUNCTION refresh_leaderboard() IS 'Recalculates and updates all leaderboard rankings based on current badge points';