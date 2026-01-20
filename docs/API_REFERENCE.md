# API Reference

## Overview
This document provides comprehensive API reference for the authentication system, including React hooks, context providers, and service interfaces.

## Authentication Providers

### AuthProvider Interface
Base interface that all authentication providers must implement.

```typescript
interface AuthProvider {
  readonly name: string;
  readonly type: AuthProviderType;

  // Core authentication methods
  register(userData: UserRegistrationData): Promise<AuthResult>;
  login(identifier: string, password?: string): Promise<AuthResult>;
  logout(): Promise<void>;
  refreshSession(): Promise<AuthResult>;

  // User management
  getCurrentUser(): Promise<User | null>;
  updateUser(userData: Partial<UserProfile>): Promise<AuthResult>;
  deleteUser(): Promise<void>;

  // Session management
  isAuthenticated(): boolean;
  getSessionInfo(): SessionInfo | null;

  // Provider-specific capabilities
  getCapabilities(): AuthCapabilities;
}
```

### SimpleAuthProvider
Email-only authentication provider for Phase 1.

```typescript
class SimpleAuthProvider implements AuthProvider {
  name = 'Simple Email Auth';
  type = 'simple' as const;

  async register(userData: UserRegistrationData): Promise<AuthResult> {
    // Validates email, creates user profile, stores in localStorage
  }

  async login(email: string): Promise<AuthResult> {
    // Looks up user by email, creates session
  }

  async logout(): Promise<void> {
    // Clears localStorage, invalidates session
  }

  // ... other methods
}
```

### SupabaseAuthProvider (Phase 2)
Password-based authentication with Supabase Auth.

```typescript
class SupabaseAuthProvider implements AuthProvider {
  name = 'Supabase Authentication';
  type = 'supabase' as const;

  async register(userData: UserRegistrationData): Promise<AuthResult> {
    // Creates Supabase auth user, links to user_profiles
  }

  async login(email: string, password: string): Promise<AuthResult> {
    // Authenticates with Supabase, creates session
  }

  // ... additional Supabase-specific methods
  async resetPassword(email: string): Promise<void>;
  async updatePassword(newPassword: string): Promise<void>;
  async confirmEmail(token: string): Promise<AuthResult>;
}
```

### OktaAuthProvider (Phase 3)
Enterprise SSO authentication with Okta.

```typescript
class OktaAuthProvider implements AuthProvider {
  name = 'Okta Enterprise SSO';
  type = 'okta' as const;

  async register(userData: UserRegistrationData): Promise<AuthResult> {
    // Redirects to Okta for registration
  }

  async login(email: string): Promise<AuthResult> {
    // Initiates Okta SSO flow
  }

  // ... Okta-specific methods
  async initiateSSO(): Promise<void>;
  async handleCallback(code: string, state: string): Promise<AuthResult>;
  async getOktaProfile(): Promise<OktaProfile>;
}
```

## React Context and Hooks

### AuthContext
Provides authentication state throughout the application.

```typescript
interface AuthContextType {
  // Current state
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authProvider: AuthProvider | null;

  // Authentication actions
  register: (userData: UserRegistrationData) => Promise<AuthResult>;
  login: (email: string, password?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<UserProfile>) => Promise<AuthResult>;

  // Provider management
  switchProvider: (providerType: AuthProviderType) => Promise<void>;
  getAvailableProviders: () => AuthProviderType[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

### useAuth Hook
Primary hook for authentication operations.

```typescript
function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Usage example
function LoginForm() {
  const { login, isLoading, user } = useAuth();

  const handleSubmit = async (email: string, password?: string) => {
    const result = await login(email, password);
    if (result.success) {
      // Handle successful login
    }
  };

  return (
    // JSX
  );
}
```

### useUser Hook
Simplified hook for accessing user information.

```typescript
function useUser(): {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
} {
  const { user, isAuthenticated, isLoading } = useAuth();
  return { user, isAuthenticated, isLoading };
}

// Usage example
function UserProfile() {
  const { user, isAuthenticated } = useUser();

  if (!isAuthenticated || !user) {
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

### useAuthProvider Hook
Hook for managing authentication providers.

```typescript
function useAuthProvider(): {
  currentProvider: AuthProvider | null;
  availableProviders: AuthProviderType[];
  switchProvider: (type: AuthProviderType) => Promise<void>;
  providerCapabilities: AuthCapabilities;
} {
  // Implementation
}

// Usage example
function AuthSettings() {
  const { currentProvider, availableProviders, switchProvider } = useAuthProvider();

  return (
    <div>
      <p>Current: {currentProvider?.name}</p>
      {availableProviders.map(type => (
        <button key={type} onClick={() => switchProvider(type)}>
          Switch to {type}
        </button>
      ))}
    </div>
  );
}
```

## Type Definitions

### Core Types

```typescript
type AuthProviderType = 'simple' | 'supabase' | 'okta';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  authProvider: AuthProviderType;
  externalAuthId?: string;
  createdAt: Date;
  lastSeen: Date;
  isActive: boolean;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  // Extensible for future profile fields
  [key: string]: any;
}

interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional for simple auth
  agreedToTerms: boolean;
}

interface AuthResult {
  success: boolean;
  user?: User;
  error?: AuthError;
  requiresEmailVerification?: boolean;
  requiresPasswordReset?: boolean;
}

interface AuthError {
  code: string;
  message: string;
  details?: any;
}

interface SessionInfo {
  userId: string;
  email: string;
  expiresAt?: Date;
  authProvider: AuthProviderType;
  sessionId: string;
}

interface AuthCapabilities {
  supportsPassword: boolean;
  supportsSSO: boolean;
  supportsEmailVerification: boolean;
  supportsMFA: boolean;
  supportsPasswordReset: boolean;
  requiresExternalRedirect: boolean;
}
```

### Provider-Specific Types

```typescript
// Okta-specific types
interface OktaProfile {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  groups?: string[];
  department?: string;
  organization?: string;
}

// Supabase-specific types
interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: SupabaseUser;
}
```

## Utility Functions

### Email Validation
```typescript
function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
  return emailRegex.test(email);
}
```

### Name Validation
```typescript
function validateName(name: string): boolean {
  return name.trim().length >= 1 && name.trim().length <= 50;
}
```

### Session Storage
```typescript
interface SessionStorage {
  saveSession(sessionInfo: SessionInfo): void;
  getSession(): SessionInfo | null;
  clearSession(): void;
  isSessionValid(): boolean;
}

class LocalSessionStorage implements SessionStorage {
  private readonly SESSION_KEY = 'auth_session';

  saveSession(sessionInfo: SessionInfo): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionInfo));
  }

  getSession(): SessionInfo | null {
    const stored = localStorage.getItem(this.SESSION_KEY);
    if (!stored) return null;

    try {
      const session = JSON.parse(stored);
      return this.isSessionValid(session) ? session : null;
    } catch {
      return null;
    }
  }

  clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  isSessionValid(session?: SessionInfo): boolean {
    if (!session) session = this.getSession();
    if (!session) return false;

    return !session.expiresAt || new Date() < new Date(session.expiresAt);
  }
}
```

## API Endpoints (Backend)

### User Management
```typescript
// GET /api/auth/me
interface GetCurrentUserResponse {
  user: User | null;
}

// POST /api/auth/register
interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  authProvider?: AuthProviderType;
}

interface RegisterResponse extends AuthResult {}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password?: string;
  authProvider?: AuthProviderType;
}

interface LoginResponse extends AuthResult {}

// POST /api/auth/logout
interface LogoutResponse {
  success: boolean;
}

// PATCH /api/auth/profile
interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  // Other updateable fields
}

interface UpdateProfileResponse extends AuthResult {}
```

### Provider Management
```typescript
// GET /api/auth/providers
interface GetProvidersResponse {
  available: AuthProviderType[];
  current?: AuthProviderType;
  capabilities: Record<AuthProviderType, AuthCapabilities>;
}

// POST /api/auth/switch-provider
interface SwitchProviderRequest {
  newProvider: AuthProviderType;
  migrationData?: any;
}

interface SwitchProviderResponse {
  success: boolean;
  requiresRedirect?: boolean;
  redirectUrl?: string;
  error?: AuthError;
}
```

## Error Codes

### Common Error Codes
```typescript
enum AuthErrorCode {
  // Validation errors
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_NAME = 'INVALID_NAME',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Authentication errors
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Registration errors
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  REGISTRATION_DISABLED = 'REGISTRATION_DISABLED',

  // Provider errors
  PROVIDER_NOT_AVAILABLE = 'PROVIDER_NOT_AVAILABLE',
  PROVIDER_CONFIGURATION_ERROR = 'PROVIDER_CONFIGURATION_ERROR',
  EXTERNAL_AUTH_FAILED = 'EXTERNAL_AUTH_FAILED',

  // Network/server errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}
```

### Error Handling
```typescript
function handleAuthError(error: AuthError): string {
  switch (error.code) {
    case AuthErrorCode.INVALID_EMAIL:
      return 'Please enter a valid email address.';
    case AuthErrorCode.USER_NOT_FOUND:
      return 'No account found with this email address.';
    case AuthErrorCode.EMAIL_ALREADY_EXISTS:
      return 'An account with this email already exists.';
    case AuthErrorCode.SESSION_EXPIRED:
      return 'Your session has expired. Please sign in again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}
```

## Configuration

### Environment Variables
```typescript
interface AuthConfig {
  // Provider selection
  AUTH_PROVIDER: AuthProviderType;

  // Simple auth config
  SIMPLE_AUTH_ENABLED: boolean;

  // Supabase config
  SUPABASE_AUTH_ENABLED: boolean;
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;

  // Okta config
  OKTA_ENABLED: boolean;
  OKTA_DOMAIN: string;
  OKTA_CLIENT_ID: string;
  OKTA_CLIENT_SECRET: string;
  OKTA_REDIRECT_URI: string;

  // Security settings
  SESSION_TIMEOUT_HOURS: number;
  PASSWORD_MIN_LENGTH: number;
  RATE_LIMIT_REQUESTS_PER_MINUTE: number;
}
```

### Runtime Configuration
```typescript
class AuthConfigManager {
  static getProviderConfig(type: AuthProviderType): ProviderConfig {
    switch (type) {
      case 'simple':
        return {
          enabled: process.env.SIMPLE_AUTH_ENABLED === 'true',
          sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
        };
      case 'supabase':
        return {
          enabled: process.env.SUPABASE_AUTH_ENABLED === 'true',
          url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        };
      case 'okta':
        return {
          enabled: process.env.OKTA_ENABLED === 'true',
          domain: process.env.OKTA_DOMAIN!,
          clientId: process.env.OKTA_CLIENT_ID!,
        };
    }
  }
}
```

## Testing Utilities

### Mock Providers
```typescript
class MockAuthProvider implements AuthProvider {
  name = 'Mock Provider';
  type = 'simple' as const;

  private mockUsers: User[] = [];
  private currentUser: User | null = null;

  async register(userData: UserRegistrationData): Promise<AuthResult> {
    const user: User = {
      id: `mock_${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      authProvider: 'simple',
      createdAt: new Date(),
      lastSeen: new Date(),
      isActive: true,
    };

    this.mockUsers.push(user);
    this.currentUser = user;

    return { success: true, user };
  }

  // ... other mock implementations
}
```

### Test Helpers
```typescript
function createTestUser(overrides: Partial<User> = {}): User {
  return {
    id: 'test_user_1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    authProvider: 'simple',
    createdAt: new Date(),
    lastSeen: new Date(),
    isActive: true,
    ...overrides,
  };
}

function mockAuthResult(success: boolean, user?: User, error?: AuthError): AuthResult {
  return { success, user, error };
}
```

## Related Documentation
- [Auth Architecture](./AUTH_ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Migration Guide](./MIGRATION_GUIDE.md)