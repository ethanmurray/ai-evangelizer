-- Use case follows: allow users to follow use cases for notifications
CREATE TABLE use_case_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  use_case_id uuid NOT NULL REFERENCES use_cases(id) ON DELETE CASCADE,
  frequency text NOT NULL DEFAULT 'instant' CHECK (frequency IN ('instant', 'daily', 'off')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, use_case_id)
);

CREATE INDEX idx_use_case_follows_user ON use_case_follows(user_id);
CREATE INDEX idx_use_case_follows_use_case ON use_case_follows(use_case_id);
CREATE INDEX idx_use_case_follows_active ON use_case_follows(use_case_id)
  WHERE frequency != 'off';

-- Queue for daily digest emails
CREATE TABLE follow_digest_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  use_case_id uuid NOT NULL REFERENCES use_cases(id) ON DELETE CASCADE,
  comment_id uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz  -- NULL until the daily digest cron processes it
);

CREATE INDEX idx_follow_digest_queue_unsent ON follow_digest_queue(follower_id)
  WHERE sent_at IS NULL;
