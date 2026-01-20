# Authentication System Documentation

## Overview

The AI Evangelizer authentication system is designed with a provider abstraction pattern that supports multiple authentication methods while maintaining a consistent API. This architecture enables seamless migration from simple email-based authentication to enterprise-grade systems like Supabase Auth and Okta SSO.

## Architecture

### Provider Pattern
The system uses the Strategy pattern to abstract different authentication providers:

```
AuthProvider Interface
├── SimpleAuthProvider (Phase 1)
├── SupabaseAuthProvider (Phase 2)
└── OktaAuthProvider (Phase 3)
```

### Directory Structure
```
src/lib/auth/
├── providers/           # Auth provider implementations
│   ├── SimpleAuthProvider.ts
│   ├── SupabaseAuthProvider.ts (future)
│   └── OktaAuthProvider.ts (future)
├── context/            # React context and providers
│   ├── AuthContext.tsx
│   └── AuthProvider.tsx
├── hooks/              # React hooks for auth operations
│   ├── useAuth.ts
│   ├── useUser.ts
│   └── useAuthProvider.ts
├── types/              # TypeScript type definitions
│   └── auth.ts
├── utils/              # Utility functions
│   ├── validation.ts
│   ├── storage.ts
│   ├── database.ts
│   └── migration.ts (future)
└── README.md           # This file
```

## Current Implementation (Phase 1)

### Simple Email-Based Authentication
- **Registration**: First name, last name, email (no password required)
- **Login**: Email lookup only
- **Storage**: localStorage for session persistence
- **Security**: Basic validation and rate limiting

### Key Features
1. **Zero Friction**: No password requirements or email verification
2. **Session Persistence**: Users stay logged in across browser sessions
3. **Validation**: Email format and name length validation
4. **Rate Limiting**: Client-side rate limiting to prevent abuse

## Usage

### Basic Authentication
```typescript
import { useAuth } from '@/lib/auth/hooks/useAuth';

function LoginForm() {
  const { register, login, logout, user, isLoading } = useAuth();

  const handleRegister = async (userData: UserRegistrationData) => {
    const result = await register(userData);
    if (result.success) {
      // User is now registered and logged in
    }
  };

  const handleLogin = async (email: string) => {
    const result = await login(email);
    if (result.success) {
      // User is now logged in
    }
  };
}
```

### User Information
```typescript
import { useUser } from '@/lib/auth/hooks/useUser';

function UserProfile() {
  const { user, isAuthenticated, isLoading } = useUser();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

### Auth Provider Management
```typescript
import { useAuthProvider } from '@/lib/auth/hooks/useAuthProvider';

function AuthSettings() {
  const { currentProvider, availableProviders, switchProvider } = useAuthProvider();

  return (
    <div>
      <p>Current Provider: {currentProvider?.name}</p>
      {availableProviders.map(type => (
        <button key={type} onClick={() => switchProvider(type)}>
          Switch to {type}
        </button>
      ))}
    </div>
  );
}
```

## Database Schema

### user_profiles Table
The main user table designed for cross-provider compatibility:

```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY,
  auth_provider text DEFAULT 'simple',
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  external_auth_id text NULL, -- For future Supabase/Okta integration
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);
```

### Key Design Decisions
1. **auth_provider**: Tracks which system created the user
2. **external_auth_id**: Links to external auth systems (Supabase/Okta)
3. **email**: Primary identifier across all authentication phases
4. **is_active**: Enables soft deletion and account management

## Future Migrations

### Phase 2: Supabase Authentication
- Add password-based authentication
- Email verification support
- Enhanced session management
- Row Level Security (RLS) policies

### Phase 3: Okta Enterprise SSO
- Corporate single sign-on
- SAML/OAuth integration
- Advanced role-based access control
- Multi-factor authentication

### Migration Strategy
1. **Backward Compatibility**: Existing users continue to work
2. **Email Matching**: Users are linked during migration via email
3. **Gradual Rollout**: Multiple providers supported simultaneously
4. **Zero Data Loss**: All user data preserved during transitions

## Security Considerations

### Current (Phase 1)
- Email validation and sanitization
- Client-side rate limiting
- Input sanitization to prevent XSS
- Session timeout management

### Future Phases
- Password hashing and validation
- Email verification workflows
- Multi-factor authentication
- Advanced session management
- Comprehensive audit logging

## Error Handling

### Error Types
```typescript
enum AuthErrorCode {
  INVALID_EMAIL = 'INVALID_EMAIL',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  // ... more error codes
}
```

### Error Handling Pattern
```typescript
try {
  const result = await authProvider.login(email);
  if (!result.success && result.error) {
    const userMessage = getErrorMessage(result.error);
    showErrorToUser(userMessage);
  }
} catch (error) {
  handleUnexpectedError(error);
}
```

## Testing

### Unit Tests
- Provider implementations
- Validation functions
- Storage utilities
- Database operations

### Integration Tests
- Provider switching
- Migration scenarios
- Cross-tab synchronization
- Error recovery

### Test Utilities
```typescript
// Mock providers for testing
import { MockAuthProvider } from '@/lib/auth/providers/MockAuthProvider';

// Test helpers
import { createTestUser, mockAuthResult } from '@/lib/auth/utils/testing';
```

## Configuration

### Environment Variables
```bash
# Phase 1
AUTH_PROVIDER=simple

# Phase 2
AUTH_PROVIDER=supabase
SUPABASE_AUTH_ENABLED=true

# Phase 3
AUTH_PROVIDER=okta
OKTA_ENABLED=true
OKTA_DOMAIN=company.okta.com
```

### Provider Configuration
```typescript
interface AuthConfig {
  defaultProvider: AuthProviderType;
  enabledProviders: AuthProviderType[];
  sessionTimeout: number;
  rateLimit: {
    maxAttempts: number;
    windowMs: number;
  };
}
```

## Best Practices

### 1. Always Use Hooks
```typescript
// ✅ Good
const { user } = useAuth();

// ❌ Bad - direct provider access
const user = authProvider.getCurrentUser();
```

### 2. Handle Loading States
```typescript
function UserProfile() {
  const { user, isLoading, isAuthenticated } = useUser();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <LoginPrompt />;

  return <div>Welcome, {user.firstName}!</div>;
}
```

### 3. Graceful Error Handling
```typescript
const handleLogin = async (email: string) => {
  try {
    const result = await login(email);
    if (!result.success) {
      setError(getErrorMessage(result.error!));
    }
  } catch (error) {
    setError('An unexpected error occurred');
  }
};
```

### 4. Session Management
```typescript
// Listen for session changes across tabs
useEffect(() => {
  const handleStorageChange = () => {
    // Refresh auth state when storage changes
    refreshAuthState();
  };

  window.addEventListener('auth:storage-changed', handleStorageChange);
  return () => window.removeEventListener('auth:storage-changed', handleStorageChange);
}, []);
```

## Troubleshooting

### Common Issues

#### 1. Session Not Persisting
- Check localStorage availability
- Verify session expiration settings
- Check for cross-tab conflicts

#### 2. Registration Failing
- Validate email format
- Check for existing accounts
- Verify database connection

#### 3. Provider Switching Issues
- Clear existing sessions before switching
- Verify provider configuration
- Check migration scripts

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('auth:debug', 'true');

// Provider-specific debugging
const provider = new SimpleAuthProvider({ debug: true });
```

## Contributing

### Adding New Providers
1. Implement the `AuthProvider` interface
2. Add provider to the factory function
3. Update type definitions
4. Add comprehensive tests
5. Update documentation

### Code Style
- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Include unit tests for all new functions

## Related Files
- [Database Schema](../../../docs/DATABASE_SCHEMA.md)
- [Migration Guide](../../../docs/MIGRATION_GUIDE.md)
- [API Reference](../../../docs/API_REFERENCE.md)
- [Auth Architecture](../../../docs/AUTH_ARCHITECTURE.md)