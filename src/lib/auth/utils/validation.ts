/**
 * Validation utilities for authentication
 *
 * Provides consistent validation across all auth providers
 * and user interface components.
 */

import { AuthError, AuthErrorCode, UserRegistrationData } from '../types/auth';

// Email validation regex
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

// Name validation constraints
const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 50;

// Password constraints (for future auth providers)
const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

/**
 * Validates an email address
 */
export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validates a name (first name or last name)
 */
export function validateName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= MIN_NAME_LENGTH && trimmed.length <= MAX_NAME_LENGTH;
}

/**
 * Validates a password (for Supabase/Okta auth)
 */
export function validatePassword(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH && PASSWORD_REGEX.test(password);
}

/**
 * Gets password strength feedback
 */
export function getPasswordStrength(password: string): {
  score: number; // 0-4
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= MIN_PASSWORD_LENGTH) {
    score++;
  } else {
    feedback.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
  }

  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push('Password must contain lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('Password must contain uppercase letters');
  }

  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push('Password must contain numbers');
  }

  if (/[@$!%*?&]/.test(password)) {
    score++;
  } else {
    feedback.push('Password must contain special characters');
  }

  return { score, feedback };
}

/**
 * Validates complete user registration data
 */
export function validateRegistrationData(data: UserRegistrationData): AuthError | null {
  // Check required fields
  if (!data.firstName?.trim()) {
    return {
      code: AuthErrorCode.MISSING_REQUIRED_FIELD,
      message: 'First name is required',
      details: { field: 'firstName' },
    };
  }

  if (!data.lastName?.trim()) {
    return {
      code: AuthErrorCode.MISSING_REQUIRED_FIELD,
      message: 'Last name is required',
      details: { field: 'lastName' },
    };
  }

  if (!data.email?.trim()) {
    return {
      code: AuthErrorCode.MISSING_REQUIRED_FIELD,
      message: 'Email is required',
      details: { field: 'email' },
    };
  }

  if (!data.agreedToTerms) {
    return {
      code: AuthErrorCode.TERMS_NOT_ACCEPTED,
      message: 'You must agree to the terms and conditions',
      details: { field: 'agreedToTerms' },
    };
  }

  // Validate email format
  if (!validateEmail(data.email)) {
    return {
      code: AuthErrorCode.INVALID_EMAIL,
      message: 'Please enter a valid email address',
      details: { field: 'email', value: data.email },
    };
  }

  // Validate names
  if (!validateName(data.firstName)) {
    return {
      code: AuthErrorCode.INVALID_NAME,
      message: `First name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters`,
      details: { field: 'firstName', value: data.firstName },
    };
  }

  if (!validateName(data.lastName)) {
    return {
      code: AuthErrorCode.INVALID_NAME,
      message: `Last name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters`,
      details: { field: 'lastName', value: data.lastName },
    };
  }

  // Validate password if provided (for Supabase/Okta providers)
  if (data.password !== undefined) {
    if (!validatePassword(data.password)) {
      return {
        code: AuthErrorCode.WEAK_PASSWORD,
        message: 'Password does not meet security requirements',
        details: { field: 'password', requirements: getPasswordStrength(data.password) },
      };
    }
  }

  return null; // No validation errors
}

/**
 * Validates login identifier (email)
 */
export function validateLoginIdentifier(identifier: string): AuthError | null {
  if (!identifier?.trim()) {
    return {
      code: AuthErrorCode.MISSING_REQUIRED_FIELD,
      message: 'Email is required',
      details: { field: 'identifier' },
    };
  }

  if (!validateEmail(identifier)) {
    return {
      code: AuthErrorCode.INVALID_EMAIL,
      message: 'Please enter a valid email address',
      details: { field: 'identifier', value: identifier },
    };
  }

  return null;
}

/**
 * Sanitizes user input to prevent XSS and other attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
    .substring(0, 255); // Limit length to prevent buffer overflow
}

/**
 * Sanitizes user registration data
 */
export function sanitizeRegistrationData(data: UserRegistrationData): UserRegistrationData {
  return {
    firstName: sanitizeInput(data.firstName),
    lastName: sanitizeInput(data.lastName),
    email: data.email.trim().toLowerCase(), // Email should be lowercase
    password: data.password, // Don't sanitize password, just validate
    agreedToTerms: Boolean(data.agreedToTerms),
  };
}

/**
 * Generates user-friendly error messages
 */
export function getErrorMessage(error: AuthError): string {
  switch (error.code) {
    case AuthErrorCode.INVALID_EMAIL:
      return 'Please enter a valid email address.';
    case AuthErrorCode.INVALID_NAME:
      return 'Name must be between 1 and 50 characters.';
    case AuthErrorCode.MISSING_REQUIRED_FIELD:
      return `${error.details?.field || 'Field'} is required.`;
    case AuthErrorCode.TERMS_NOT_ACCEPTED:
      return 'You must agree to the terms and conditions.';
    case AuthErrorCode.USER_NOT_FOUND:
      return 'No account found with this email address.';
    case AuthErrorCode.EMAIL_ALREADY_EXISTS:
      return 'An account with this email already exists.';
    case AuthErrorCode.INVALID_CREDENTIALS:
      return 'Invalid email or password.';
    case AuthErrorCode.ACCOUNT_DISABLED:
      return 'This account has been disabled. Please contact support.';
    case AuthErrorCode.SESSION_EXPIRED:
      return 'Your session has expired. Please sign in again.';
    case AuthErrorCode.WEAK_PASSWORD:
      return 'Password does not meet security requirements.';
    case AuthErrorCode.RATE_LIMIT_EXCEEDED:
      return 'Too many attempts. Please wait before trying again.';
    case AuthErrorCode.NETWORK_ERROR:
      return 'Network error. Please check your connection and try again.';
    case AuthErrorCode.SERVER_ERROR:
      return 'Server error. Please try again later.';
    case AuthErrorCode.DATABASE_ERROR:
      return 'Database error. Please try again later.';
    case AuthErrorCode.PROVIDER_NOT_AVAILABLE:
      return 'Authentication service is temporarily unavailable.';
    case AuthErrorCode.PROVIDER_CONFIGURATION_ERROR:
      return 'Authentication configuration error. Please contact support.';
    case AuthErrorCode.EXTERNAL_AUTH_FAILED:
      return 'External authentication failed. Please try again.';
    case AuthErrorCode.REGISTRATION_DISABLED:
      return 'Registration is currently disabled.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Rate limiting utility for client-side rate limiting
 */
export class ClientRateLimit {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  /**
   * Check if an identifier (email) is rate limited
   */
  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) {
      return false;
    }

    // Reset if window has expired
    if (now > attempt.resetTime) {
      this.attempts.delete(identifier);
      return false;
    }

    return attempt.count >= this.maxAttempts;
  }

  /**
   * Record an attempt for an identifier
   */
  recordAttempt(identifier: string): void {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
    } else {
      attempt.count++;
    }
  }

  /**
   * Get remaining attempts for an identifier
   */
  getRemainingAttempts(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt || Date.now() > attempt.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - attempt.count);
  }

  /**
   * Get time until rate limit resets (in milliseconds)
   */
  getResetTime(identifier: string): number | null {
    const attempt = this.attempts.get(identifier);
    if (!attempt || Date.now() > attempt.resetTime) {
      return null;
    }
    return attempt.resetTime - Date.now();
  }
}