-- Add shipping address to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS shipping_address text;

-- Level prizes: tracks when users reach new levels and prize fulfillment
CREATE TABLE level_prizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rank_name text NOT NULL,
  rank_min_points int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  fulfilled_at timestamptz,
  UNIQUE(user_id, rank_min_points)
);

CREATE INDEX idx_level_prizes_user ON level_prizes(user_id);
CREATE INDEX idx_level_prizes_unfulfilled ON level_prizes(id) WHERE fulfilled_at IS NULL;
