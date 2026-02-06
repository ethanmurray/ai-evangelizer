/**
 * Authentication Module Entry Point
 *
 * Exports all public authentication APIs for easy importing throughout the app.
 */

// Context and Providers
export { AuthProvider, useAuthContext, withAuth } from './context/AuthContext';
export type { AuthProviderProps, AuthContextType } from './context/AuthContext';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useUser } from './hooks/useUser';
export { useAuthProvider } from './hooks/useAuthProvider';
export type { UseAuthReturn } from './hooks/useAuth';
export type { UseUserReturn } from './hooks/useUser';
export type { UseAuthProviderReturn } from './hooks/useAuthProvider';

// Types
export type {
  AuthProviderType,
  User,
  UserProfile,
  UserRegistrationData,
  AuthResult,
  AuthError,
  SessionInfo,
  AuthCapabilities,
  AuthProvider as IAuthProvider,
} from './types/auth';
export { AuthErrorCode } from './types/auth';

// Providers
export { SimpleAuthProvider } from './providers/SimpleAuthProvider';
export type { SimpleAuthProviderConfig } from './providers/SimpleAuthProvider';

// Utilities
export {
  validateEmail,
  validateName,
  validatePassword,
  validateRegistrationData,
  validateLoginIdentifier,
  sanitizeInput,
  sanitizeRegistrationData,
  getErrorMessage,
  ClientRateLimit,
} from './utils/validation';

export {
  LocalSessionStorage,
  MemorySessionStorage,
  createSessionStorage,
  getSessionStorage,
  generateSessionId,
  createSessionInfo,
  setupStorageEventListeners,
  cleanupSessionStorage,
} from './utils/storage';

export {
  userFromRow,
  userToRow,
  createUserProfile,
  findUserByEmail,
  findUserById,
  findUserByExternalAuthId,
  updateUserProfile,
  updateUserLastSeen,
  linkUserToExternalAuth,
  deactivateUser,
  getUserCount,
  isEarlyAdopter,
  BatchUserOperations,
  checkDatabaseHealth,
} from './utils/database';

// Re-export database types
export type { UserProfileRow, UserFromRow } from './types/auth';