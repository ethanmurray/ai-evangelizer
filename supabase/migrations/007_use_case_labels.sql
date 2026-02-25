-- Add searchable labels to use_cases
ALTER TABLE use_cases ADD COLUMN labels text[] DEFAULT '{}';

-- GIN index for efficient array overlap queries
CREATE INDEX idx_use_cases_labels ON use_cases USING GIN (labels);

-- Assign labels to existing seed use cases
UPDATE use_cases SET labels = '{"Coding","Code Generation"}' WHERE title = 'Code generation';
UPDATE use_cases SET labels = '{"Coding","Code Quality"}' WHERE title = 'Code review';
UPDATE use_cases SET labels = '{"Coding","Debugging"}' WHERE title = 'Debug assistance';
UPDATE use_cases SET labels = '{"Coding","Testing"}' WHERE title = 'Write unit tests';
UPDATE use_cases SET labels = '{"Documentation","Writing"}' WHERE title = 'Documentation';
UPDATE use_cases SET labels = '{"Data","SQL"}' WHERE title = 'SQL query writing';
UPDATE use_cases SET labels = '{"Coding","Text Processing"}' WHERE title = 'Regex generation';
UPDATE use_cases SET labels = '{"Coding","Code Quality"}' WHERE title = 'Code refactoring';
UPDATE use_cases SET labels = '{"Learning","Frameworks"}' WHERE title = 'Learn a new framework';
UPDATE use_cases SET labels = '{"Data","Automation"}' WHERE title = 'Data transformation';
UPDATE use_cases SET labels = '{"Coding","APIs"}' WHERE title = 'API integration';
UPDATE use_cases SET labels = '{"DevOps","Git"}' WHERE title = 'Git help';
UPDATE use_cases SET labels = '{"DevOps","Automation"}' WHERE title = 'Shell scripting';
UPDATE use_cases SET labels = '{"Coding","Code Generation"}' WHERE title = 'Code translation';
