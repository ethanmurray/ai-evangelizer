CREATE TABLE difficulty_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  use_case_id uuid NOT NULL REFERENCES use_cases(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, use_case_id)
);

CREATE INDEX idx_difficulty_use_case ON difficulty_ratings(use_case_id);

CREATE VIEW use_case_difficulty_stats AS
SELECT use_case_id, AVG(rating)::numeric(3,1) AS avg_difficulty, COUNT(*)::int AS rating_count
FROM difficulty_ratings GROUP BY use_case_id;
