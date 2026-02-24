ALTER TABLE shares ADD COLUMN confirmation_token text UNIQUE;
ALTER TABLE shares ADD COLUMN confirmed_at timestamptz;
CREATE INDEX idx_shares_confirmation_token ON shares(confirmation_token) WHERE confirmation_token IS NOT NULL;
