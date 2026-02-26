-- Multi-team support: allow users to belong to multiple teams
-- The users.team column is kept as the "primary team" for backwards compatibility

CREATE TABLE user_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_name text NOT NULL,
  is_primary boolean DEFAULT false,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(user_id, team_name)
);

CREATE INDEX idx_user_teams_user ON user_teams(user_id);
CREATE INDEX idx_user_teams_team ON user_teams(team_name);

-- Backfill from existing users.team
INSERT INTO user_teams (user_id, team_name, is_primary)
SELECT id, team, true
FROM users
WHERE team IS NOT NULL AND team != '' AND is_stub = false;
