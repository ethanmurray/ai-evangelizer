-- Cult of AI: Full schema rebuild
-- Drop old views and functions
DROP VIEW IF EXISTS leaderboard_view CASCADE;
DROP VIEW IF EXISTS user_badge_summary CASCADE;
DROP FUNCTION IF EXISTS refresh_leaderboard() CASCADE;

-- Drop old tables
DROP TABLE IF EXISTS leaderboard_entries CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop new tables if they exist (idempotent)
DROP VIEW IF EXISTS user_progress_summary CASCADE;
DROP VIEW IF EXISTS use_case_upvote_counts CASCADE;
DROP VIEW IF EXISTS user_completed_counts CASCADE;
DROP TABLE IF EXISTS shares CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS upvotes CASCADE;
DROP TABLE IF EXISTS use_cases CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- ==========================================
-- New Schema
-- ==========================================

CREATE TABLE teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  team text NOT NULL,
  is_stub boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE use_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  resources text,
  submitted_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE upvotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  use_case_id uuid NOT NULL REFERENCES use_cases(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, use_case_id)
);

CREATE TABLE progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  use_case_id uuid NOT NULL REFERENCES use_cases(id),
  seen_at timestamptz,
  done_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, use_case_id)
);

CREATE TABLE shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sharer_id uuid NOT NULL REFERENCES users(id),
  recipient_id uuid NOT NULL REFERENCES users(id),
  use_case_id uuid NOT NULL REFERENCES use_cases(id),
  created_at timestamptz DEFAULT now()
);

-- ==========================================
-- Views
-- ==========================================

-- Count of shares per user per use case (helper)
-- user_progress_summary: user_id, use_case_id, seen_at, done_at, share_count, is_completed
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
  GROUP BY sharer_id, use_case_id
) s ON s.sharer_id = p.user_id AND s.use_case_id = p.use_case_id;

-- user_completed_counts: user_id, completed_count
CREATE VIEW user_completed_counts AS
SELECT
  user_id,
  COUNT(*)::int AS completed_count
FROM user_progress_summary
WHERE is_completed = true
GROUP BY user_id;

-- use_case_upvote_counts: use_case_id, upvote_count
CREATE VIEW use_case_upvote_counts AS
SELECT
  use_case_id,
  COUNT(*)::int AS upvote_count
FROM upvotes
GROUP BY use_case_id;

-- ==========================================
-- Seed 14 Use Cases
-- ==========================================

INSERT INTO use_cases (title, description, resources) VALUES
  ('Code generation', 'Use AI to write boilerplate code, utility functions, or scaffold new features', 'Try asking: "Write a React component that..." or "Create a Python function to..."'),
  ('Code review', 'Have AI review your PR for bugs, style issues, or improvements', 'Paste your diff and ask for a review focusing on correctness, performance, and readability'),
  ('Debug assistance', 'Paste error messages and stack traces to get debugging suggestions', 'Include the full error message, relevant code, and what you expected to happen'),
  ('Write unit tests', 'Generate test cases for existing functions', 'Provide the function signature and describe edge cases you want covered'),
  ('Documentation', 'Generate README files, docstrings, or API documentation', 'Works great for JSDoc, Python docstrings, OpenAPI specs, and markdown READMEs'),
  ('SQL query writing', 'Describe what data you need in plain English, get SQL back', 'Include your table schema for best results. Works with PostgreSQL, MySQL, SQLite, etc.'),
  ('Regex generation', 'Describe the pattern you need, get a working regex', 'Always test the output! Include examples of strings that should and should not match'),
  ('Code refactoring', 'Ask AI to simplify, optimize, or modernize existing code', 'Specify your target: readability, performance, modern syntax, or design patterns'),
  ('Learn a new framework', 'Use AI as an interactive tutor for unfamiliar technologies', 'Start with "Explain X to me as a senior developer new to this framework"'),
  ('Data transformation', 'Convert data between formats (JSON, CSV, XML, etc.)', 'Paste a sample of your input data and describe the desired output format'),
  ('API integration', 'Get help understanding and integrating third-party APIs', 'Share the API docs URL or paste relevant endpoints. Ask for error handling patterns too'),
  ('Git help', 'Complex git operations explained and generated', 'Great for interactive rebases, cherry-picks, bisects, and fixing detached HEAD states'),
  ('Shell scripting', 'Generate bash/zsh scripts for automation tasks', 'Describe the task, target OS, and any tools that should be used (awk, sed, jq, etc.)'),
  ('Code translation', 'Convert code between programming languages', 'Specify source and target languages. Note any framework-specific idioms to preserve');
