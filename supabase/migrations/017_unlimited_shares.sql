-- Allow unlimited shares per use case.
-- Completion still requires >= 2 shares (user_progress_summary unchanged).
-- Bonus: 1 extra point per share beyond 2.

-- Drop cascading views
DROP VIEW IF EXISTS user_total_points CASCADE;
DROP VIEW IF EXISTS user_points_breakdown CASCADE;

-- Recreate user_points_breakdown with extra_share_points
CREATE VIEW user_points_breakdown AS
SELECT
  p.user_id,
  p.use_case_id,
  CASE WHEN p.seen_at IS NOT NULL THEN 1 ELSE 0 END as learned_points,
  CASE WHEN p.done_at IS NOT NULL THEN 3 ELSE 0 END as applied_points,
  CASE WHEN COALESCE(s.share_count, 0) >= 1 THEN 6 ELSE 0 END as shared_points,
  -- 1 bonus point per share beyond 2
  CASE WHEN COALESCE(s.share_count, 0) > 2
    THEN COALESCE(s.share_count, 0) - 2
    ELSE 0
  END as extra_share_points,
  -- total_points includes extra share bonus
  CASE
    WHEN p.seen_at IS NOT NULL AND p.done_at IS NULL AND COALESCE(s.share_count, 0) = 0 THEN 1
    WHEN p.done_at IS NOT NULL AND COALESCE(s.share_count, 0) = 0 THEN 4
    WHEN COALESCE(s.share_count, 0) >= 1 THEN 10 +
      CASE WHEN COALESCE(s.share_count, 0) > 2
        THEN COALESCE(s.share_count, 0) - 2
        ELSE 0
      END
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

-- Recreate user_total_points (same structure as 006, updated to use new view)
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
GRANT SELECT ON user_points_breakdown TO authenticated;
GRANT SELECT ON user_total_points TO authenticated;
