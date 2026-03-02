-- Daily challenge completions tracking
-- Users can complete 1 of 3 daily challenges (easy/medium/hard) per workday
-- for +2 bonus points. Consecutive workday completions build a streak.

CREATE TABLE daily_challenge_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_date date NOT NULL,
  challenge_type text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  bonus_points_awarded boolean NOT NULL DEFAULT true,
  UNIQUE(user_id, challenge_date)
);

CREATE INDEX idx_daily_challenge_user_date
  ON daily_challenge_completions(user_id, challenge_date DESC);

-- Grant permissions
GRANT SELECT, INSERT ON daily_challenge_completions TO authenticated;

-- Recreate user_total_points to include daily challenge bonus points
DROP VIEW IF EXISTS user_total_points CASCADE;

CREATE VIEW user_total_points AS
SELECT
  u.id as user_id,
  u.name,
  u.team,
  COALESCE(SUM(pb.total_points), 0)::int as activity_points,
  COALESCE(MAX(sub.submission_points), 0)::int as submission_points,
  COALESCE(MAX(sub.viral_bonus_points), 0)::int as viral_bonus_points,
  COALESCE(MAX(tp.teaching_points), 0)::int as teaching_points,
  COALESCE(dc.daily_challenge_points, 0)::int as daily_challenge_points,
  (
    COALESCE(SUM(pb.total_points), 0) +
    COALESCE(MAX(sub.submission_points), 0) +
    COALESCE(MAX(sub.viral_bonus_points), 0) +
    COALESCE(MAX(tp.teaching_points), 0) +
    COALESCE(dc.daily_challenge_points, 0)
  )::int as total_points,
  COUNT(DISTINCT CASE WHEN pb.learned_points > 0 THEN pb.use_case_id END)::int as learned_count,
  COUNT(DISTINCT CASE WHEN pb.applied_points > 0 THEN pb.use_case_id END)::int as applied_count,
  COUNT(DISTINCT CASE WHEN pb.shared_points > 0 THEN pb.use_case_id END)::int as shared_count,
  COALESCE(MAX(sub.submission_count), 0)::int as submitted_count,
  COALESCE(MAX(tp.teaching_count), 0)::int as teaching_count,
  COALESCE(MAX(sub.viral_use_cases), ARRAY[]::uuid[]) as viral_use_cases
FROM users u
LEFT JOIN user_points_breakdown pb ON pb.user_id = u.id
LEFT JOIN user_submission_bonuses sub ON sub.user_id = u.id
LEFT JOIN user_teaching_points tp ON tp.user_id = u.id
LEFT JOIN (
  SELECT user_id, (COUNT(*) * 2)::int as daily_challenge_points
  FROM daily_challenge_completions
  WHERE bonus_points_awarded = true
  GROUP BY user_id
) dc ON dc.user_id = u.id
WHERE u.is_stub = false
GROUP BY u.id, u.name, u.team, dc.daily_challenge_points
ORDER BY total_points DESC;

-- Re-grant permissions
GRANT SELECT ON user_total_points TO authenticated;
