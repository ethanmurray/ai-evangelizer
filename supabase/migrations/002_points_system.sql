-- Points system views for AI Evangelizer
-- This migration creates views to calculate user points based on activities

-- Drop views if they exist (for rerunning migration)
DROP VIEW IF EXISTS user_total_points CASCADE;
DROP VIEW IF EXISTS user_submission_bonuses CASCADE;
DROP VIEW IF EXISTS user_points_breakdown CASCADE;

-- View: user_points_breakdown
-- Detailed points breakdown per user per use case
CREATE VIEW user_points_breakdown AS
SELECT
  p.user_id,
  p.use_case_id,
  -- 1 point for Learned (seen_at)
  CASE WHEN p.seen_at IS NOT NULL THEN 1 ELSE 0 END as learned_points,
  -- 3 additional points for Applied (done_at)
  CASE WHEN p.done_at IS NOT NULL THEN 3 ELSE 0 END as applied_points,
  -- 6 additional points for Shared (at least one share)
  CASE WHEN COALESCE(s.share_count, 0) >= 1 THEN 6 ELSE 0 END as shared_points,
  -- Total points for this use case (max 10 per use case)
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
  GROUP BY sharer_id, use_case_id
) s ON s.sharer_id = p.user_id AND s.use_case_id = p.use_case_id;

-- View: user_submission_bonuses
-- Track submission points and viral bonuses for content creators
CREATE VIEW user_submission_bonuses AS
SELECT
  uc.submitted_by as user_id,
  COUNT(DISTINCT uc.id)::int as submission_count,
  -- 5 points per submitted use case
  COUNT(DISTINCT uc.id)::int * 5 as submission_points,
  -- Count use cases that have been shared by 5+ unique users
  SUM(
    CASE
      WHEN share_stats.unique_sharers >= 5 THEN 15
      ELSE 0
    END
  )::int as viral_bonus_points,
  -- List of use cases that went viral
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
  GROUP BY use_case_id
) share_stats ON share_stats.use_case_id = uc.id
WHERE uc.submitted_by IS NOT NULL
GROUP BY uc.submitted_by;

-- View: user_total_points
-- Aggregate total points per user
CREATE VIEW user_total_points AS
SELECT
  u.id as user_id,
  u.name,
  u.team,
  -- Points from learning, applying, and sharing
  COALESCE(SUM(pb.total_points), 0)::int as activity_points,
  -- Points from submitting use cases
  COALESCE(MAX(sub.submission_points), 0)::int as submission_points,
  -- Bonus points for viral content
  COALESCE(MAX(sub.viral_bonus_points), 0)::int as viral_bonus_points,
  -- Total points
  (
    COALESCE(SUM(pb.total_points), 0) +
    COALESCE(MAX(sub.submission_points), 0) +
    COALESCE(MAX(sub.viral_bonus_points), 0)
  )::int as total_points,
  -- Breakdown details
  COUNT(DISTINCT CASE WHEN pb.learned_points > 0 THEN pb.use_case_id END)::int as learned_count,
  COUNT(DISTINCT CASE WHEN pb.applied_points > 0 THEN pb.use_case_id END)::int as applied_count,
  COUNT(DISTINCT CASE WHEN pb.shared_points > 0 THEN pb.use_case_id END)::int as shared_count,
  COALESCE(MAX(sub.submission_count), 0)::int as submitted_count,
  COALESCE(MAX(sub.viral_use_cases), ARRAY[]::uuid[]) as viral_use_cases
FROM users u
LEFT JOIN user_points_breakdown pb ON pb.user_id = u.id
LEFT JOIN user_submission_bonuses sub ON sub.user_id = u.id
WHERE u.is_stub = false
GROUP BY u.id, u.name, u.team
ORDER BY total_points DESC;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_shares_sharer_use_case ON shares(sharer_id, use_case_id);
CREATE INDEX IF NOT EXISTS idx_use_cases_submitted_by ON use_cases(submitted_by) WHERE submitted_by IS NOT NULL;

-- Grant permissions
GRANT SELECT ON user_points_breakdown TO authenticated;
GRANT SELECT ON user_submission_bonuses TO authenticated;
GRANT SELECT ON user_total_points TO authenticated;