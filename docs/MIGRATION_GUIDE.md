# Authentication Migration Guide

## Overview
This guide provides step-by-step instructions for migrating the authentication system through different phases, ensuring zero user data loss and minimal downtime.

## Migration Phases

### Phase 1: Simple Email-Based Auth (Current)
- **Status**: ✅ Implemented
- **Users**: Email-only registration
- **Storage**: localStorage for sessions
- **Security**: Basic validation only

### Phase 2: Supabase Authentication
- **Target**: Add password-based authentication
- **Benefits**: Proper session management, enhanced security
- **Compatibility**: Maintain email-only users alongside authenticated users

### Phase 3: Enterprise Okta Integration
- **Target**: Corporate SSO integration
- **Benefits**: Enterprise-grade security, centralized user management
- **Compatibility**: Support all previous auth methods

## Phase 1 → Phase 2 Migration

### Pre-Migration Checklist
- [ ] Backup production database
- [ ] Test migration scripts in staging environment
- [ ] Prepare rollback procedures
- [ ] Schedule maintenance window (recommended: 2-4 hours)
- [ ] Notify users of upcoming changes
- [ ] Prepare support team for potential issues

### Migration Steps

#### Step 1: Enable Supabase Auth
```sql
-- Enable Supabase Auth (if not already enabled)
-- This is done through Supabase dashboard
-- Authentication → Settings → Enable email confirmations
```

#### Step 2: Update Database Schema
```sql
-- Add auth provider tracking
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS auth_provider text DEFAULT 'simple'
CHECK (auth_provider IN ('simple', 'supabase', 'okta'));

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS external_auth_id text NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_external_auth_id
ON user_profiles(external_auth_id) WHERE external_auth_id IS NOT NULL;

-- Update existing users
UPDATE user_profiles
SET auth_provider = 'simple'
WHERE auth_provider IS NULL;
```

#### Step 3: Deploy New Auth Provider Code
```bash
# Deploy the SupabaseAuthProvider implementation
# Update environment variables
echo "AUTH_PROVIDER=hybrid" >> .env.production
echo "SUPABASE_AUTH_ENABLED=true" >> .env.production

# Deploy to production
vercel deploy --prod
```

#### Step 4: User Migration Strategy

**Option A: Automatic Migration (Recommended)**
```typescript
// Migration function to run during user login
async function migrateUserToSupabaseAuth(email: string, firstName: string, lastName: string) {
  // Create Supabase auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password: generateTemporaryPassword(), // Send via email
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        migrated_from: 'simple'
      }
    }
  });

  if (!error && data.user) {
    // Link to existing profile
    await supabase
      .from('user_profiles')
      .update({
        auth_provider: 'supabase',
        external_auth_id: data.user.id
      })
      .eq('email', email);
  }
}
```

**Option B: Opt-in Migration**
- Add "Upgrade Account" option in user profile
- Send email invitations to existing users
- Allow gradual migration over time

#### Step 5: Update Row Level Security
```sql
-- Enhanced RLS policies for Supabase Auth
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS uuid AS $$
  SELECT COALESCE(
    auth.uid(),
    (current_setting('app.current_user_id', true))::uuid
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Update policies
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
FOR UPDATE USING (
  id = get_current_user_id() OR
  (auth.uid() IS NOT NULL AND external_auth_id = auth.uid()::text)
);
```

#### Step 6: Verification and Testing
```bash
# Test user authentication flows
npm run test:auth

# Verify database integrity
npm run verify:migration

# Check user login success rates
npm run monitor:auth-metrics
```

### Rollback Procedure (Phase 2)
```sql
-- Emergency rollback script
BEGIN;

-- Revert auth provider changes
UPDATE user_profiles
SET auth_provider = 'simple',
    external_auth_id = NULL
WHERE auth_provider = 'supabase';

-- Remove Supabase-specific policies
DROP POLICY IF EXISTS "Supabase users can update profile" ON user_profiles;

-- Restore simple auth policies
CREATE POLICY "Users can update own profile" ON user_profiles
FOR UPDATE USING (email = current_setting('app.current_user_email'));

COMMIT;
```

## Phase 2 → Phase 3 Migration

### Pre-Migration Requirements
- Okta organization setup
- SAML/OAuth configuration
- Corporate directory synchronization
- IT security approval

### Migration Steps

#### Step 1: Okta Configuration
```javascript
// Okta SDK configuration
const oktaConfig = {
  baseUrl: process.env.OKTA_DOMAIN,
  clientId: process.env.OKTA_CLIENT_ID,
  clientSecret: process.env.OKTA_CLIENT_SECRET,
  redirectUri: `${process.env.NEXT_PUBLIC_URL}/auth/callback/okta`
};
```

#### Step 2: User Directory Synchronization
```sql
-- Create temporary mapping table
CREATE TABLE okta_user_mapping (
  email text PRIMARY KEY,
  okta_id text NOT NULL,
  okta_profile jsonb,
  sync_date timestamptz DEFAULT now()
);

-- Bulk import from Okta directory
-- (Implementation depends on corporate directory structure)
```

#### Step 3: Gradual Migration Strategy
```typescript
// Corporate users migrate to Okta
// External users remain on Supabase Auth
async function determineAuthProvider(email: string): Promise<AuthProvider> {
  const domain = email.split('@')[1];
  const corporateDomains = ['yourcompany.com', 'subsidiary.com'];

  if (corporateDomains.includes(domain)) {
    return 'okta';
  }
  return 'supabase'; // Keep existing auth for external users
}
```

#### Step 4: Update Authentication Flow
```typescript
// Multi-provider authentication resolver
class AuthProviderResolver {
  async resolveProvider(email: string): Promise<AuthProviderType> {
    // Check for existing user
    const user = await this.findUserByEmail(email);
    if (user?.auth_provider) {
      return user.auth_provider;
    }

    // Determine provider for new users
    return await this.determineAuthProvider(email);
  }
}
```

### Rollback Procedure (Phase 3)
```sql
-- Revert Okta users back to Supabase
UPDATE user_profiles
SET auth_provider = 'supabase'
WHERE auth_provider = 'okta'
  AND external_auth_id IN (
    SELECT supabase_id FROM okta_supabase_mapping
  );
```

## Migration Monitoring

### Key Metrics to Track
```typescript
interface MigrationMetrics {
  totalUsers: number;
  migratedUsers: number;
  failedMigrations: number;
  authSuccessRate: number;
  userSatisfactionScore: number;
}
```

### Monitoring Dashboard Queries
```sql
-- Migration progress
SELECT
  auth_provider,
  COUNT(*) as user_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM user_profiles
WHERE is_active = true
GROUP BY auth_provider;

-- Authentication failure rates
SELECT
  DATE_TRUNC('hour', created_at) as hour,
  auth_provider,
  COUNT(*) as login_attempts,
  COUNT(*) FILTER (WHERE success = true) as successful_logins
FROM auth_logs
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY hour, auth_provider
ORDER BY hour DESC;
```

## Best Practices

### Communication Strategy
1. **Pre-Migration**: Email users 1 week before migration
2. **During Migration**: Status page with real-time updates
3. **Post-Migration**: Follow-up email with new features
4. **Support**: Dedicated support channel during migration window

### Testing Protocol
1. **Staging Migration**: Complete end-to-end test
2. **Load Testing**: Simulate production traffic
3. **User Acceptance Testing**: Key stakeholders verify functionality
4. **Rollback Testing**: Verify rollback procedures work

### Data Integrity Checks
```sql
-- Pre-migration data validation
SELECT
  COUNT(*) as total_users,
  COUNT(DISTINCT email) as unique_emails,
  COUNT(*) - COUNT(DISTINCT email) as duplicate_emails
FROM user_profiles;

-- Post-migration validation
SELECT
  auth_provider,
  COUNT(*) as users,
  COUNT(external_auth_id) as linked_accounts,
  COUNT(*) - COUNT(external_auth_id) as unlinked_accounts
FROM user_profiles
GROUP BY auth_provider;
```

### Security Considerations
- [ ] Audit auth provider permissions
- [ ] Review RLS policies for each provider
- [ ] Test session management and timeout
- [ ] Verify password requirements (Phase 2+)
- [ ] Check MFA configuration (Phase 3)

## Troubleshooting

### Common Issues

#### Migration Fails for Some Users
```typescript
// Retry failed migrations
async function retryFailedMigrations() {
  const failedUsers = await getUsersWithoutExternalId();

  for (const user of failedUsers) {
    try {
      await migrateUser(user);
      console.log(`Successfully migrated: ${user.email}`);
    } catch (error) {
      console.error(`Migration failed for ${user.email}:`, error);
      // Log for manual intervention
    }
  }
}
```

#### Authentication Loops
```typescript
// Clear corrupt sessions
function clearAuthState() {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('user-profile');
  // Redirect to fresh login
  window.location.href = '/auth/login';
}
```

#### Performance Degradation
```sql
-- Add missing indexes during migration
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_auth_lookup
ON user_profiles(auth_provider, email)
WHERE is_active = true;
```

## Support and Escalation

### Migration Team Contacts
- **Technical Lead**: [Implementation team lead]
- **Database Admin**: [DBA contact]
- **Security Officer**: [Security team contact]
- **Product Manager**: [Product team contact]

### Escalation Procedures
1. **Level 1**: Migration script failures → Technical Lead
2. **Level 2**: Data integrity issues → Database Admin
3. **Level 3**: Security concerns → Security Officer
4. **Level 4**: User experience issues → Product Manager

### Emergency Contacts
- **On-call Engineer**: [24/7 contact]
- **Emergency Rollback Authority**: [Decision maker]

## Post-Migration Tasks

### Phase 2 Completion
- [ ] Remove simple auth code paths (after 30-day overlap)
- [ ] Update documentation
- [ ] Conduct security audit
- [ ] Collect user feedback
- [ ] Plan Phase 3 timeline

### Phase 3 Completion
- [ ] Decommission Supabase Auth for corporate users
- [ ] Finalize enterprise security policies
- [ ] Complete compliance documentation
- [ ] Train support team on Okta integration
- [ ] Archive migration tools and documentation

## Related Documentation
- [Auth Architecture](./AUTH_ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [API Reference](./API_REFERENCE.md)