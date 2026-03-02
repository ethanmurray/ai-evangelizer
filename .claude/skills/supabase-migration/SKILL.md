---
name: supabase-migration
description: Use this skill to generate Supabase migration files for the AI Evangelizer project. Invoke when the user says "/migrate", "create a migration", "add a database table", "modify the schema", "add a column", or needs to make any database schema changes. This skill follows the project's existing migration conventions and includes RLS policies.
user-invokable: true
---

# Supabase Migration Generator

Generate migration files for the AI Evangelizer project following existing conventions.

## Project Context

- **Migrations directory:** `supabase/migrations/`
- **Current migrations:** `001_` through `020_` (21 files, including two `001_*` variants)
- **Database:** Supabase (PostgreSQL)
- **Known issue:** RLS is currently disabled on most tables (P0 security item). New migrations should include RLS policies.

## Workflow

### 1. Determine Next Migration Number

Read the `supabase/migrations/` directory to find the highest-numbered migration. The new file should be the next number, zero-padded to 3 digits.

Example: If the latest is `020_daily_challenges.sql`, the next is `021_your_feature.sql`.

### 2. Follow Naming Convention

```
{NNN}_{descriptive_snake_case_name}.sql
```

Examples from the project:
- `010_badges.sql`
- `012_comments.sql`
- `018_use_case_follows.sql`

### 3. Follow SQL Conventions

Based on existing migrations, use these patterns:

**Table creation:**
```sql
CREATE TABLE table_name (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- other columns
  created_at timestamptz DEFAULT now()
);
```

**Standard patterns:**
- UUIDs for primary keys with `gen_random_uuid()`
- `timestamptz` (not `timestamp`) for all date/time columns
- `DEFAULT now()` for `created_at`
- `ON DELETE CASCADE` for foreign keys referencing `users(id)`
- `NOT NULL` where appropriate
- `text` for strings (not `varchar`)
- `jsonb` for flexible metadata columns

**Indexes:**
```sql
CREATE INDEX idx_{table}_{column} ON table_name(column);
-- Partial indexes for common filtered queries:
CREATE INDEX idx_{table}_{filter} ON table_name(column) WHERE condition = true;
```

**Constraints:**
```sql
-- CHECK constraints for enums:
ALTER TABLE table_name ADD CONSTRAINT table_column_check
  CHECK (column IN ('value1', 'value2', 'value3'));

-- Unique constraints:
ALTER TABLE table_name ADD CONSTRAINT table_unique_cols
  UNIQUE (col1, col2);
```

### 4. Include RLS Policies

New tables should enable RLS. Follow this pattern:

```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON table_name FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own data
CREATE POLICY "Users can insert own data"
  ON table_name FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON table_name FOR UPDATE
  USING (user_id = auth.uid());
```

Note: This project currently uses anon key access without RLS (see PRODUCTION_READINESS.md P0-7). When RLS is fully enabled, these policies will take effect.

### 5. Write the Migration

Write the file to `supabase/migrations/{NNN}_{name}.sql`.

### 6. Verify

After writing, read the file back and check:
- SQL syntax is valid
- Foreign keys reference existing tables
- Index names are unique
- Constraint names follow convention
- RLS policies are included for new tables
