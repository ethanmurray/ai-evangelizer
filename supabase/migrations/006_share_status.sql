-- Add status column to shares for resilience against email scanner pre-clicks.
-- Deny now sets status='denied' instead of deleting the row, allowing users
-- to re-confirm after a scanner-triggered deny.

-- Add status column, default 'pending'
ALTER TABLE shares ADD COLUMN status text NOT NULL DEFAULT 'pending';

-- Backfill existing rows
UPDATE shares SET status = 'confirmed' WHERE confirmed_at IS NOT NULL;

-- Index for status queries
CREATE INDEX idx_shares_status ON shares(status);

-- Recreate all views that depend on shares.
-- Each shares subquery now has WHERE status != 'denied' so denied shares
-- are excluded from counts, points, and completion checks.

DROP VIEW IF EXISTS user_total_points CASCADE;
DROP VIEW IF EXISTS user_completed_counts CASCADE;
DROP VIEW IF EXISTS user_submission_bonuses CASCADE;
DROP VIEW IF EXISTS user_points_breakdown CASCADE;
DROP VIEW IF EXISTS user_progress_summary CASCADE;

-- 1. user_progress_summary (from 001_cult_of_ai, now with status filter)
CREATE VIEW user_progress_summary AS
SELECT
  p.user_id,
  p.use_case_id,
  p.seen_at,
  p.done_at,
  COALESCE(s.share_count, 0) AS share_count,
  (p.seen_at IS NOT NULL AND p.done_at IS NOT NULL AND COALESCE(s.share_count, 0) >= 2) AS is_completed
FROM progress p
LEFT JOIN (
  SELECT sharer_id, use_case_id, COUNT(*)::int AS share_count
  FROM shares
  WHERE status != 'denied'
  GROUP BY sharer_id, use_case_id
) s ON s.sharer_id = p.user_id AND s.use_case_id = p.use_case_id;

-- 2. user_completed_counts (from 001_cult_of_ai, unchanged logic)
CREATE VIEW user_completed_counts AS
SELECT
  user_id,
  COUNT(*)::int AS completed_count
FROM user_progress_summary
WHERE is_completed = true
GROUP BY user_id;

-- 3. user_points_breakdown (from 002, now with status filter)
CREATE VIEW user_points_breakdown AS
SELECT
  p.user_id,
  p.use_case_id,
  CASE WHEN p.seen_at IS NOT NULL THEN 1 ELSE 0 END as learned_points,
  CASE WHEN p.done_at IS NOT NULL THEN 3 ELSE 0 END as applied_points,
  CASE WHEN COALESCE(s.share_count, 0) >= 1 THEN 6 ELSE 0 END as shared_points,
  CASE
    WHEN p.seen_at IS NOT NULL AND p.done_at IS NULL AND COALESCE(s.share_count, 0) = 0 THEN 1
    WHEN p.done_at IS NOT NULL AND COALESCE(s.share_count, 0) = 0 THEN 4
    WHEN COALESCE(s.share_count, 0) >= 1 THEN 10
    ELSE 0
  END as total_points,
  COALESCE(s.share_count, 0) as share_count
FROM progress p
LEFT JOIN (
  SELECT sharer_id, use_case_id, COUNT(*)::int as share_count
  FROM shares
  WHERE status != 'denied'
  GROUP BY sharer_id, use_case_id
) s ON s.sharer_id = p.user_id AND s.use_case_id = p.use_case_id;

-- 4. user_submission_bonuses (from 002, now with status filter)
CREATE VIEW user_submission_bonuses AS
SELECT
  uc.submitted_by as user_id,
  COUNT(DISTINCT uc.id)::int as submission_count,
  COUNT(DISTINCT uc.id)::int * 5 as submission_points,
  SUM(
    CASE
      WHEN share_stats.unique_sharers >= 5 THEN 15
      ELSE 0
    END
  )::int as viral_bonus_points,
  array_agg(
    CASE
      WHEN share_stats.unique_sharers >= 5 THEN uc.id
      ELSE NULL
    END
  ) FILTER (WHERE share_stats.unique_sharers >= 5) as viral_use_cases
FROM use_cases uc
LEFT JOIN (
  SELECT
    use_case_id,
    COUNT(DISTINCT sharer_id)::int as unique_sharers
  FROM shares
  WHERE status != 'denied'
  GROUP BY use_case_id
) share_stats ON share_stats.use_case_id = uc.id
WHERE uc.submitted_by IS NOT NULL
GROUP BY uc.submitted_by;

-- 5. user_total_points (from 003, definitive version with teaching_points)
CREATE VIEW user_total_points AS
SELECT
  u.id as user_id,
  u.name,
  u.team,
  COALESCE(SUM(pb.total_points), 0)::int as activity_points,
  COALESCE(MAX(sub.submission_points), 0)::int as submission_points,
  COALESCE(MAX(sub.viral_bonus_points), 0)::int as viral_bonus_points,
  COALESCE(MAX(tp.teaching_points), 0)::int as teaching_points,
  (
    COALESCE(SUM(pb.total_points), 0) +
    COALESCE(MAX(sub.submission_points), 0) +
    COALESCE(MAX(sub.viral_bonus_points), 0) +
    COALESCE(MAX(tp.teaching_points), 0)
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
WHERE u.is_stub = false
GROUP BY u.id, u.name, u.team
ORDER BY total_points DESC;

-- Re-grant permissions
GRANT SELECT ON user_progress_summary TO authenticated;
GRANT SELECT ON user_completed_counts TO authenticated;
GRANT SELECT ON user_points_breakdown TO authenticated;
GRANT SELECT ON user_submission_bonuses TO authenticated;
GRANT SELECT ON user_total_points TO authenticated;
