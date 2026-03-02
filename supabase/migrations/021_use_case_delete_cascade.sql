-- Fix: add ON DELETE CASCADE to all FK references to use_cases
-- Without this, deleting a use case fails with FK constraint violations
-- (activity_events and attributions were never handled in app code)

-- activity_events.use_case_id
ALTER TABLE activity_events
  DROP CONSTRAINT activity_events_use_case_id_fkey,
  ADD CONSTRAINT activity_events_use_case_id_fkey
    FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE;

-- attributions.use_case_id
ALTER TABLE attributions
  DROP CONSTRAINT attributions_use_case_id_fkey,
  ADD CONSTRAINT attributions_use_case_id_fkey
    FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE;

-- upvotes.use_case_id
ALTER TABLE upvotes
  DROP CONSTRAINT upvotes_use_case_id_fkey,
  ADD CONSTRAINT upvotes_use_case_id_fkey
    FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE;

-- progress.use_case_id
ALTER TABLE progress
  DROP CONSTRAINT progress_use_case_id_fkey,
  ADD CONSTRAINT progress_use_case_id_fkey
    FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE;

-- shares.use_case_id
ALTER TABLE shares
  DROP CONSTRAINT shares_use_case_id_fkey,
  ADD CONSTRAINT shares_use_case_id_fkey
    FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE;
