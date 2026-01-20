# Database Schema Documentation

## Overview
This document defines the database schema for the AI Evangelizer Leaderboard, designed for current functionality and future authentication system migrations.

## Core Tables

### user_profiles
Primary table for all user information, designed to work with multiple authentication providers.

```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_provider text NOT NULL DEFAULT 'simple' CHECK (auth_provider IN ('simple', 'supabase', 'okta')),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  external_auth_id text NULL, -- References auth.users.id (Supabase) or Okta user ID
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Indexes for performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_auth_provider ON user_profiles(auth_provider);
CREATE INDEX idx_user_profiles_external_auth_id ON user_profiles(external_auth_id) WHERE external_auth_id IS NOT NULL;
CREATE INDEX idx_user_profiles_active ON user_profiles(is_active) WHERE is_active = true;
```

### badges
Defines available badges that users can earn.

```sql
CREATE TABLE badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon_url text,
  points integer DEFAULT 0,
  category text NOT NULL DEFAULT 'general',
  requirements jsonb, -- Flexible requirements definition
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badges_active ON badges(is_active) WHERE is_active = true;
```

### user_badges
Junction table for user badge achievements.

```sql
CREATE TABLE user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at timestamptz DEFAULT now(),
  awarded_by uuid REFERENCES user_profiles(id), -- Optional: who awarded the badge
  notes text, -- Optional context for the award

  UNIQUE(user_id, badge_id) -- Prevent duplicate badges
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX idx_user_badges_awarded_at ON user_badges(awarded_at);
```

### leaderboard_entries
Computed or cached leaderboard positions.

```sql
CREATE TABLE leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  total_points integer DEFAULT 0,
  badge_count integer DEFAULT 0,
  rank_position integer,
  last_calculated timestamptz DEFAULT now(),

  UNIQUE(user_id)
);

CREATE INDEX idx_leaderboard_rank ON leaderboard_entries(rank_position);
CREATE INDEX idx_leaderboard_points ON leaderboard_entries(total_points DESC);
```

## Field Descriptions

### user_profiles Fields

| Field | Type | Purpose | Migration Notes |
|-------|------|---------|-----------------|
| `id` | uuid | Primary key | Stable across all auth phases |
| `auth_provider` | text | Tracks which auth system created this user | 'simple' → 'supabase' → 'okta' |
| `email` | text | Unique identifier across all phases | Used for user matching during migrations |
| `first_name` | text | User's first name | Always required, collected at registration |
| `last_name` | text | User's last name | Always required, collected at registration |
| `external_auth_id` | text | References to external auth systems | NULL for simple auth, populated during migration |
| `created_at` | timestamptz | Account creation time | Preserved during auth migrations |
| `updated_at` | timestamptz | Last profile update | Updated during migrations |
| `last_seen` | timestamptz | Last activity timestamp | Used for user engagement tracking |
| `is_active` | boolean | Account status | Allows soft deletion |

### badges Fields

| Field | Type | Purpose | Notes |
|-------|------|---------|--------|
| `requirements` | jsonb | Flexible badge criteria | Supports complex logic, API integrations |
| `points` | integer | Point value for leaderboard | Allows weighted badge system |
| `category` | text | Badge grouping | For filtering and organization |

### Migration Compatibility

#### Phase 1 → Phase 2 (Supabase Auth)
```sql
-- Migration script excerpt
UPDATE user_profiles
SET auth_provider = 'supabase',
    external_auth_id = auth.users.id
WHERE email = auth.users.email;
```

#### Phase 2 → Phase 3 (Okta Integration)
```sql
-- Migration script excerpt
UPDATE user_profiles
SET auth_provider = 'okta',
    external_auth_id = okta_user_mapping.okta_id
WHERE email = okta_user_mapping.email;
```

## Row Level Security (RLS) Policies

### Current (Phase 1) - Minimal Security
```sql
-- Simple read access for all authenticated sessions
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (email = current_setting('app.current_user_email'));
```

### Future (Phase 2) - Supabase Auth Integration
```sql
-- More sophisticated policies with proper authentication
CREATE POLICY "Users can view all profiles" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid()::text = external_auth_id);

CREATE POLICY "Service role can manage all" ON user_profiles
  FOR ALL USING (auth.role() = 'service_role');
```

### Future (Phase 3) - Enterprise Okta Policies
```sql
-- Role-based access with Okta integration
CREATE POLICY "View profiles based on Okta roles" ON user_profiles
  FOR SELECT USING (
    current_setting('app.okta_roles')::jsonb ? 'profile_viewer' OR
    external_auth_id = current_setting('app.current_okta_id')
  );
```

## Data Integrity Constraints

### Email Validation
```sql
-- Add email format validation
ALTER TABLE user_profiles
ADD CONSTRAINT valid_email
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');
```

### Badge Requirements Validation
```sql
-- Ensure badge requirements are valid JSON
ALTER TABLE badges
ADD CONSTRAINT valid_requirements
CHECK (requirements IS NULL OR jsonb_typeof(requirements) = 'object');
```

## Views for Common Queries

### User Leaderboard View
```sql
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
  up.id,
  up.first_name,
  up.last_name,
  up.email,
  COALESCE(le.total_points, 0) as total_points,
  COALESCE(le.badge_count, 0) as badge_count,
  COALESCE(le.rank_position, 999999) as rank_position
FROM user_profiles up
LEFT JOIN leaderboard_entries le ON up.id = le.user_id
WHERE up.is_active = true
ORDER BY le.rank_position NULLS LAST;
```

### User Badge Summary View
```sql
CREATE OR REPLACE VIEW user_badge_summary AS
SELECT
  up.id as user_id,
  up.first_name,
  up.last_name,
  COUNT(ub.badge_id) as total_badges,
  SUM(b.points) as total_points,
  array_agg(b.name ORDER BY ub.awarded_at DESC) as recent_badges
FROM user_profiles up
LEFT JOIN user_badges ub ON up.id = ub.user_id
LEFT JOIN badges b ON ub.badge_id = b.id
WHERE up.is_active = true
GROUP BY up.id, up.first_name, up.last_name;
```

## Backup and Recovery Considerations

### Critical Data Priority
1. **user_profiles** - Contains all user identity information
2. **user_badges** - Badge achievement history
3. **badges** - Badge definitions and requirements
4. **leaderboard_entries** - Can be recalculated but expensive

### Migration Rollback Strategy
- Always backup before auth provider migrations
- Store migration timestamps for rollback reference
- Maintain parallel auth systems during transition periods
- Test rollback procedures in staging environment

## Performance Considerations

### Expected Query Patterns
- Frequent leaderboard reads (cached/materialized)
- User profile lookups by email (indexed)
- Badge achievement writes (moderate frequency)
- User activity updates (high frequency)

### Scaling Recommendations
- Consider partitioning user_badges by date for large badge volumes
- Implement read replicas for leaderboard queries
- Use materialized views for complex leaderboard calculations
- Cache frequently accessed badge configurations

## Related Documentation
- [Auth Architecture](./AUTH_ARCHITECTURE.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [API Reference](./API_REFERENCE.md)