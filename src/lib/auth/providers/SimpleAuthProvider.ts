/**
 * Simple Email-Based Authentication Provider
 *
 * Phase 1 implementation that provides friction-free user onboarding
 * with email-only registration and login. No passwords required.
 *
 * Features:
 * - Email-only registration and login
 * - localStorage session persistence
 * - Client-side rate limiting
 * - Input validation and sanitization
 * - Automatic session management
 */

import {
  AuthProvider,
  AuthResult,
  AuthCapabilities,
  User,
  UserRegistrationData,
  UserProfile,
  SessionInfo,
  AuthError,
  AuthErrorCode,
} from '../types/auth';
import {
  validateRegistrationData,
  validateLoginIdentifier,
  sanitizeRegistrationData,
  ClientRateLimit,
} from '../utils/validation';
import {
  SessionStorage,
  getSessionStorage,
  createSessionInfo,
} from '../utils/storage';
import {
  createUserProfile,
  findUserByEmail,
  findUserById,
  updateUserProfile,
  updateUserLastSeen,
} from '../utils/database';

export interface SimpleAuthProviderConfig {
  sessionTimeoutHours?: number;
  rateLimit?: {
    maxAttempts: number;
    windowMs: number;
  };
  debug?: boolean;
}

export class SimpleAuthProvider implements AuthProvider {
  readonly name = 'Simple Email Authentication';
  readonly type = 'simple' as const;

  private storage: SessionStorage;
  private rateLimit: ClientRateLimit;
  private config: Required<SimpleAuthProviderConfig>;

  constructor(config: SimpleAuthProviderConfig = {}) {
    this.config = {
      sessionTimeoutHours: config.sessionTimeoutHours || 24,
      rateLimit: config.rateLimit || {
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000, // 15 minutes
      },
      debug: config.debug || false,
    };

    this.storage = getSessionStorage();
    this.rateLimit = new ClientRateLimit(
      this.config.rateLimit.maxAttempts,
      this.config.rateLimit.windowMs
    );

    this.debug('SimpleAuthProvider initialized', this.config);
  }

  /**
   * Register a new user with email-only authentication
   */
  async register(userData: UserRegistrationData): Promise<AuthResult> {
    this.debug('Starting registration for:', userData.email);

    try {
      // Rate limiting check
      if (this.rateLimit.isRateLimited(userData.email)) {
        const resetTime = this.rateLimit.getResetTime(userData.email);
        const remainingMinutes = resetTime ? Math.ceil(resetTime / (60 * 1000)) : 0;

        return {
          success: false,
          error: {
            code: AuthErrorCode.RATE_LIMIT_EXCEEDED,
            message: `Too many registration attempts. Please wait ${remainingMinutes} minutes.`,
            details: { resetTime, remainingAttempts: 0 },
          },
        };
      }

      // Validate and sanitize input
      const validationError = validateRegistrationData(userData);
      if (validationError) {
        this.rateLimit.recordAttempt(userData.email);
        return { success: false, error: validationError };
      }

      const sanitizedData = sanitizeRegistrationData(userData);

      // Check if user already exists
      const existingUser = await findUserByEmail(sanitizedData.email);
      if (existingUser) {
        this.rateLimit.recordAttempt(userData.email);
        return {
          success: false,
          error: {
            code: AuthErrorCode.EMAIL_ALREADY_EXISTS,
            message: 'An account with this email already exists',
            details: { email: sanitizedData.email },
          },
        };
      }

      // Create new user profile
      const user = await createUserProfile(sanitizedData, 'simple');
      this.debug('User created successfully:', user.id);

      // Create session
      const sessionInfo = createSessionInfo(user, this.config.sessionTimeoutHours);

      // Save to storage
      this.storage.saveUser(user);
      this.storage.saveSession(sessionInfo);

      // Update last seen
      await updateUserLastSeen(user.id);

      this.debug('Registration completed successfully for:', user.email);

      return {
        success: true,
        user,
        sessionInfo,
      };
    } catch (error) {
      this.debug('Registration failed:', error);
      this.rateLimit.recordAttempt(userData.email);

      if (error && typeof error === 'object' && 'code' in error) {
        return { success: false, error: error as AuthError };
      }

      return {
        success: false,
        error: {
          code: AuthErrorCode.SERVER_ERROR,
          message: 'Registration failed due to a server error',
          details: error,
        },
      };
    }
  }

  /**
   * Login existing user with email lookup
   */
  async login(email: string): Promise<AuthResult> {
    this.debug('Starting login for:', email);

    try {
      // Rate limiting check
      if (this.rateLimit.isRateLimited(email)) {
        const resetTime = this.rateLimit.getResetTime(email);
        const remainingMinutes = resetTime ? Math.ceil(resetTime / (60 * 1000)) : 0;

        return {
          success: false,
          error: {
            code: AuthErrorCode.RATE_LIMIT_EXCEEDED,
            message: `Too many login attempts. Please wait ${remainingMinutes} minutes.`,
            details: { resetTime, remainingAttempts: 0 },
          },
        };
      }

      // Validate email
      const validationError = validateLoginIdentifier(email);
      if (validationError) {
        this.rateLimit.recordAttempt(email);
        return { success: false, error: validationError };
      }

      // Find user by email
      const user = await findUserByEmail(email);
      if (!user) {
        this.rateLimit.recordAttempt(email);
        return {
          success: false,
          error: {
            code: AuthErrorCode.USER_NOT_FOUND,
            message: 'No account found with this email address',
            details: { email },
          },
        };
      }

      // Check if account is active
      if (!user.isActive) {
        this.rateLimit.recordAttempt(email);
        return {
          success: false,
          error: {
            code: AuthErrorCode.ACCOUNT_DISABLED,
            message: 'This account has been disabled',
            details: { userId: user.id },
          },
        };
      }

      // Create session
      const sessionInfo = createSessionInfo(user, this.config.sessionTimeoutHours);

      // Save to storage
      this.storage.saveUser(user);
      this.storage.saveSession(sessionInfo);

      // Update last seen
      await updateUserLastSeen(user.id);

      this.debug('Login completed successfully for:', user.email);

      return {
        success: true,
        user,
        sessionInfo,
      };
    } catch (error) {
      this.debug('Login failed:', error);
      this.rateLimit.recordAttempt(email);

      if (error && typeof error === 'object' && 'code' in error) {
        return { success: false, error: error as AuthError };
      }

      return {
        success: false,
        error: {
          code: AuthErrorCode.SERVER_ERROR,
          message: 'Login failed due to a server error',
          details: error,
        },
      };
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    this.debug('Starting logout');

    try {
      const session = this.storage.getSession();
      if (session) {
        this.debug('Logging out user:', session.userId);
      }

      // Clear all stored data
      this.storage.clearAll();

      this.debug('Logout completed successfully');
    } catch (error) {
      this.debug('Logout error (non-critical):', error);
      // Don't throw errors for logout - always succeed
    }
  }

  /**
   * Refresh current session
   */
  async refreshSession(): Promise<AuthResult> {
    this.debug('Refreshing session');

    try {
      const currentSession = this.storage.getSession();
      if (!currentSession || !this.storage.isSessionValid(currentSession)) {
        this.debug('No valid session to refresh');
        return {
          success: false,
          error: {
            code: AuthErrorCode.SESSION_EXPIRED,
            message: 'Session has expired',
          },
        };
      }

      // Get current user from database
      const user = await findUserById(currentSession.userId);
      if (!user || !user.isActive) {
        this.debug('User not found or inactive during session refresh');
        this.storage.clearAll();
        return {
          success: false,
          error: {
            code: AuthErrorCode.USER_NOT_FOUND,
            message: 'User account no longer exists',
          },
        };
      }

      // Create new session with extended expiration
      const newSessionInfo = createSessionInfo(user, this.config.sessionTimeoutHours);

      // Update storage
      this.storage.saveUser(user);
      this.storage.saveSession(newSessionInfo);

      // Update last seen
      await updateUserLastSeen(user.id);

      this.debug('Session refreshed successfully for:', user.email);

      return {
        success: true,
        user,
        sessionInfo: newSessionInfo,
      };
    } catch (error) {
      this.debug('Session refresh failed:', error);

      if (error && typeof error === 'object' && 'code' in error) {
        return { success: false, error: error as AuthError };
      }

      return {
        success: false,
        error: {
          code: AuthErrorCode.SERVER_ERROR,
          message: 'Failed to refresh session',
          details: error,
        },
      };
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    this.debug('Getting current user');

    try {
      // Check for valid session first
      if (!this.isAuthenticated()) {
        this.debug('No valid session found');
        return null;
      }

      const user = this.storage.getUser();
      if (!user) {
        this.debug('No user data in storage');
        return null;
      }

      // Optionally refresh user data from database
      // For simple auth, we trust the cached user data
      this.debug('Returning current user:', user.email);
      return user;
    } catch (error) {
      this.debug('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateUser(userData: Partial<UserProfile>): Promise<AuthResult> {
    this.debug('Updating user profile');

    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: {
            code: AuthErrorCode.SESSION_EXPIRED,
            message: 'You must be logged in to update your profile',
          },
        };
      }

      // Update in database
      const updatedUser = await updateUserProfile(currentUser.id, userData);

      // Update storage
      this.storage.saveUser(updatedUser);

      this.debug('User profile updated successfully');

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      this.debug('User update failed:', error);

      if (error && typeof error === 'object' && 'code' in error) {
        return { success: false, error: error as AuthError };
      }

      return {
        success: false,
        error: {
          code: AuthErrorCode.SERVER_ERROR,
          message: 'Failed to update user profile',
          details: error,
        },
      };
    }
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    const session = this.storage.getSession();
    const isValid = session && this.storage.isSessionValid(session);
    this.debug('Authentication check:', { hasSession: !!session, isValid });
    return !!isValid;
  }

  /**
   * Get current session information
   */
  getSessionInfo(): SessionInfo | null {
    const session = this.storage.getSession();
    const isValid = session && this.storage.isSessionValid(session);
    return isValid ? session : null;
  }

  /**
   * Get provider capabilities
   */
  getCapabilities(): AuthCapabilities {
    return {
      supportsPassword: false,
      supportsSSO: false,
      supportsEmailVerification: false,
      supportsMFA: false,
      supportsPasswordReset: false,
      requiresExternalRedirect: false,
      canSwitchProviders: true,
    };
  }

  /**
   * Get rate limiting information for UI feedback
   */
  getRateLimitInfo(email: string): {
    isLimited: boolean;
    remainingAttempts: number;
    resetTime: number | null;
  } {
    return {
      isLimited: this.rateLimit.isRateLimited(email),
      remainingAttempts: this.rateLimit.getRemainingAttempts(email),
      resetTime: this.rateLimit.getResetTime(email),
    };
  }

  /**
   * Debug logging helper
   */
  private debug(message: string, data?: any): void {
    if (this.config.debug) {
      console.log(`[SimpleAuthProvider] ${message}`, data || '');
    }
  }

  /**
   * Cleanup method for when provider is destroyed
   */
  destroy(): void {
    this.debug('Destroying SimpleAuthProvider');
    // Any cleanup logic would go here
  }
}