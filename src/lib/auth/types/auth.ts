/**
 * Core authentication types
 *
 * This file defines all the type interfaces for the authentication system.
 * Designed to support multiple auth providers (simple, Supabase, Okta)
 * while maintaining backward compatibility during migrations.
 */

// Provider types
export type AuthProviderType = 'simple' | 'supabase' | 'okta';

// Core user interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  authProvider: AuthProviderType;
  externalAuthId?: string; // Links to external auth systems (Supabase/Okta)
  createdAt: Date;
  updatedAt: Date;
  lastSeen: Date;
  isActive: boolean;
}

// User profile data (for registration/updates)
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  // Extensible for future profile fields
  [key: string]: any;
}

// Registration data interface
export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional for simple auth, required for Supabase/Okta
  agreedToTerms: boolean;
}

// Authentication result
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: AuthError;
  requiresEmailVerification?: boolean;
  requiresPasswordReset?: boolean;
  sessionInfo?: SessionInfo;
}

// Authentication error
export interface AuthError {
  code: AuthErrorCode;
  message: string;
  details?: any;
}

// Error codes enum
export enum AuthErrorCode {
  // Validation errors
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_NAME = 'INVALID_NAME',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  TERMS_NOT_ACCEPTED = 'TERMS_NOT_ACCEPTED',

  // Authentication errors
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Registration errors
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  REGISTRATION_DISABLED = 'REGISTRATION_DISABLED',
  WEAK_PASSWORD = 'WEAK_PASSWORD',

  // Provider errors
  PROVIDER_NOT_AVAILABLE = 'PROVIDER_NOT_AVAILABLE',
  PROVIDER_CONFIGURATION_ERROR = 'PROVIDER_CONFIGURATION_ERROR',
  EXTERNAL_AUTH_FAILED = 'EXTERNAL_AUTH_FAILED',

  // Network/server errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

// Session information
export interface SessionInfo {
  userId: string;
  email: string;
  expiresAt?: Date;
  authProvider: AuthProviderType;
  sessionId: string;
  createdAt: Date;
}

// Provider capabilities
export interface AuthCapabilities {
  supportsPassword: boolean;
  supportsSSO: boolean;
  supportsEmailVerification: boolean;
  supportsMFA: boolean;
  supportsPasswordReset: boolean;
  requiresExternalRedirect: boolean;
  canSwitchProviders: boolean;
}

// Base auth provider interface
export interface AuthProvider {
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

  // Session management
  isAuthenticated(): boolean;
  getSessionInfo(): SessionInfo | null;

  // Provider-specific capabilities
  getCapabilities(): AuthCapabilities;
}

// Provider configuration interfaces
export interface SimpleAuthConfig {
  sessionTimeout?: number; // in milliseconds
  rateLimit?: {
    maxAttempts: number;
    windowMs: number;
  };
}

export interface SupabaseAuthConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  emailVerificationRequired?: boolean;
  passwordMinLength?: number;
}

export interface OktaAuthConfig {
  domain: string;
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scopes?: string[];
}

// Provider configuration union
export type ProviderConfig =
  | ({ type: 'simple' } & SimpleAuthConfig)
  | ({ type: 'supabase' } & SupabaseAuthConfig)
  | ({ type: 'okta' } & OktaAuthConfig);

// Database user row interface (matches database schema)
export interface UserProfileRow {
  id: string;
  auth_provider: string;
  email: string;
  first_name: string;
  last_name: string;
  external_auth_id?: string;
  created_at: string;
  updated_at: string;
  last_seen: string;
  is_active: boolean;
}

// Helper type for transforming database row to User object
export type UserFromRow = (row: UserProfileRow) => User;