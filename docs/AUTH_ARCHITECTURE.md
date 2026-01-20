# Authentication Architecture

## Overview
This document outlines the authentication system design for the AI Evangelizer Leaderboard application, including current implementation and future migration paths.

## Design Philosophy
- **Zero Friction Onboarding**: Start with email-only registration to eliminate barriers
- **Future-Proof Architecture**: Design for seamless migration to enterprise auth systems
- **User Data Preservation**: Ensure no user data loss during auth system upgrades
- **Provider Abstraction**: Support multiple auth backends through unified interface

## Current Architecture (Phase 1)

### Simple Email-Based Authentication
- **Registration**: First name, last name, email (no password)
- **Login**: Email lookup only
- **Persistence**: localStorage for device-based session management
- **Security**: Basic rate limiting, email validation only

### Database Design
```sql
user_profiles (
  id: uuid PRIMARY KEY,
  auth_provider: text DEFAULT 'simple', -- 'simple', 'supabase', 'okta'
  email: text UNIQUE NOT NULL,
  first_name: text NOT NULL,
  last_name: text NOT NULL,
  external_auth_id: text NULL, -- For future Supabase/Okta integration
  created_at: timestamptz DEFAULT now(),
  last_seen: timestamptz DEFAULT now(),
  is_active: boolean DEFAULT true
);
```

### Auth Provider Pattern
```typescript
interface AuthProvider {
  register(userData: UserRegistration): Promise<AuthResult>
  login(identifier: string): Promise<AuthResult>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
  refreshSession(): Promise<AuthResult>
}
```

## Future Architecture (Phases 2-3)

### Phase 2: Supabase Authentication
- Add password-based authentication option
- Migrate existing email-only users
- Support both simple and authenticated flows
- Row Level Security (RLS) implementation

### Phase 3: Enterprise Integration (Okta)
- Single Sign-On (SSO) capability
- SAML/OAuth integration
- Corporate directory synchronization
- Advanced role-based access control

## Migration Strategy

### User Data Preservation
1. **Email as Primary Key**: Email remains unique identifier across all phases
2. **Backward Compatibility**: Existing users auto-migrate via email matching
3. **Gradual Rollout**: Support multiple auth providers simultaneously
4. **Data Integrity**: Zero user data loss during transitions

### Migration Scripts
- `scripts/migrate-to-supabase-auth.sql` - Phase 1 to 2 migration
- `scripts/migrate-to-okta.sql` - Phase 2 to 3 migration
- `scripts/rollback-auth-migration.sql` - Emergency rollback procedures

## Security Considerations

### Current (Phase 1)
- Email validation and sanitization
- Rate limiting on registration/login
- Basic spam protection
- No sensitive data exposure

### Future Phases
- Password hashing (bcrypt/Argon2)
- Multi-factor authentication (MFA)
- Session management and rotation
- RBAC with granular permissions
- Audit logging and compliance

## Implementation Guidelines

### Code Organization
```
src/lib/auth/
├── providers/
│   ├── SimpleAuthProvider.ts
│   ├── SupabaseAuthProvider.ts (Phase 2)
│   └── OktaAuthProvider.ts (Phase 3)
├── context/
│   ├── AuthContext.tsx
│   └── AuthProvider.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useUser.ts
│   └── useAuthProvider.ts
├── types/
│   ├── auth.ts
│   └── user.ts
└── utils/
    ├── validation.ts
    ├── storage.ts
    └── migration.ts
```

### Testing Strategy
- Unit tests for each auth provider
- Integration tests for provider switching
- Migration testing with sample data
- Security penetration testing for each phase

## Configuration Management

### Environment Variables
```bash
# Phase 1
AUTH_PROVIDER=simple

# Phase 2
AUTH_PROVIDER=supabase
SUPABASE_AUTH_ENABLED=true

# Phase 3
AUTH_PROVIDER=okta
OKTA_DOMAIN=your-domain.okta.com
OKTA_CLIENT_ID=your-client-id
OKTA_CLIENT_SECRET=your-client-secret
```

## Monitoring and Analytics

### Metrics to Track
- Registration completion rates
- Login success/failure rates
- Session duration and engagement
- Migration success rates
- Authentication method preferences

### Error Handling
- Graceful degradation for auth failures
- User-friendly error messages
- Comprehensive logging for debugging
- Automatic retry mechanisms

## Best Practices

1. **Never Break Existing Users**: Always maintain backward compatibility
2. **Progressive Enhancement**: Add features without removing functionality
3. **Security First**: Implement security measures before features
4. **User Experience**: Maintain zero-friction philosophy throughout all phases
5. **Documentation**: Update this document with every auth system change

## Related Documentation
- [Database Schema](./DATABASE_SCHEMA.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [API Reference](./API_REFERENCE.md)