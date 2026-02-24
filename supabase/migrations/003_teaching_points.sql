-- Teaching points: award 1 point each time someone credits you for teaching them

-- Table: attributions
-- Records when a learner credits a teacher for teaching them a use case
CREATE TABLE attributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES users(id),
  teacher_email text NOT NULL,
  use_case_id uuid NOT NULL REFERENCES use_cases(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_attributions_teacher_email ON attributions(teacher_email);
CREATE INDEX idx_attributions_learner_id ON attributions(learner_id);

-- View: user_teaching_points
-- Counts how many times a user was credited as a teacher (1 point each)
CREATE VIEW user_teaching_points AS
SELECT
  u.id as user_id,
  COUNT(a.id)::int as teaching_count,
  COUNT(a.id)::int as teaching_points
FROM users u
JOIN attributions a ON a.teacher_email = u.email
GROUP BY u.id;

-- Recreate user_total_points to include teaching points
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

-- Grant permissions
GRANT SELECT ON user_teaching_points TO authenticated;
GRANT SELECT ON user_total_points TO authenticated;
