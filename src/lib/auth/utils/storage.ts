/**
 * Session storage utilities
 *
 * Provides consistent session management across all auth providers
 * with localStorage persistence for better user experience.
 */

import { SessionInfo, User } from '../types/auth';

// Storage keys
const SESSION_KEY = 'ai_evangelizer_session';
const USER_KEY = 'ai_evangelizer_user';

// Session expiration check interval (5 minutes)
const EXPIRATION_CHECK_INTERVAL = 5 * 60 * 1000;

/**
 * Interface for session storage operations
 */
export interface SessionStorage {
  saveSession(sessionInfo: SessionInfo): void;
  getSession(): SessionInfo | null;
  clearSession(): void;
  isSessionValid(session?: SessionInfo): boolean;
  saveUser(user: User): void;
  getUser(): User | null;
  clearUser(): void;
  clearAll(): void;
}

/**
 * LocalStorage-based session storage implementation
 */
export class LocalSessionStorage implements SessionStorage {
  private expirationCheckTimer: NodeJS.Timeout | null = null;

  constructor() {
    // Start periodic expiration checks
    this.startExpirationChecks();
  }

  /**
   * Save session information to localStorage
   */
  saveSession(sessionInfo: SessionInfo): void {
    try {
      const sessionData = {
        ...sessionInfo,
        expiresAt: sessionInfo.expiresAt?.toISOString(),
        createdAt: sessionInfo.createdAt.toISOString(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Failed to save session to localStorage:', error);
    }
  }

  /**
   * Retrieve session information from localStorage
   */
  getSession(): SessionInfo | null {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (!stored) return null;

      const sessionData = JSON.parse(stored);
      const session: SessionInfo = {
        ...sessionData,
        expiresAt: sessionData.expiresAt ? new Date(sessionData.expiresAt) : undefined,
        createdAt: new Date(sessionData.createdAt),
      };

      return this.isSessionValid(session) ? session : null;
    } catch (error) {
      console.error('Failed to retrieve session from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear session from localStorage
   */
  clearSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear session from localStorage:', error);
    }
  }

  /**
   * Check if session is valid (not expired)
   */
  isSessionValid(session?: SessionInfo): boolean {
    if (!session) {
      const sessionData = this.getSession();
      if (!sessionData) return false;
      session = sessionData;
    }
    if (!session) return false;

    // Check if session has expired
    if (session.expiresAt && new Date() > session.expiresAt) {
      this.clearSession();
      this.clearUser();
      return false;
    }

    return true;
  }

  /**
   * Save user information to localStorage
   */
  saveUser(user: User): void {
    try {
      const userData = {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        lastSeen: user.lastSeen.toISOString(),
      };
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to save user to localStorage:', error);
    }
  }

  /**
   * Retrieve user information from localStorage
   */
  getUser(): User | null {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (!stored) return null;

      const userData = JSON.parse(stored);
      const user: User = {
        ...userData,
        createdAt: new Date(userData.createdAt),
        updatedAt: new Date(userData.updatedAt),
        lastSeen: new Date(userData.lastSeen),
      };

      // Check if we have a valid session for this user
      const session = this.getSession();
      if (!session || session.userId !== user.id) {
        this.clearUser();
        return null;
      }

      return user;
    } catch (error) {
      console.error('Failed to retrieve user from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear user from localStorage
   */
  clearUser(): void {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to clear user from localStorage:', error);
    }
  }

  /**
   * Clear all auth data from localStorage
   */
  clearAll(): void {
    this.clearSession();
    this.clearUser();
  }

  /**
   * Start periodic checks for session expiration
   */
  private startExpirationChecks(): void {
    if (typeof window === 'undefined') return; // Skip on server side

    this.expirationCheckTimer = setInterval(() => {
      const session = this.getSession();
      if (session && !this.isSessionValid(session)) {
        // Session expired, clear everything
        this.clearAll();
        // Optionally dispatch a custom event for components to listen to
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
      }
    }, EXPIRATION_CHECK_INTERVAL);
  }

  /**
   * Stop periodic expiration checks
   */
  destroy(): void {
    if (this.expirationCheckTimer) {
      clearInterval(this.expirationCheckTimer);
      this.expirationCheckTimer = null;
    }
  }
}

/**
 * In-memory session storage for testing or environments without localStorage
 */
export class MemorySessionStorage implements SessionStorage {
  private sessionData: SessionInfo | null = null;
  private userData: User | null = null;

  saveSession(sessionInfo: SessionInfo): void {
    this.sessionData = { ...sessionInfo };
  }

  getSession(): SessionInfo | null {
    if (!this.sessionData) return null;
    return this.isSessionValid(this.sessionData) ? this.sessionData : null;
  }

  clearSession(): void {
    this.sessionData = null;
  }

  isSessionValid(session?: SessionInfo): boolean {
    if (!session) {
      if (!this.sessionData) return false;
      session = this.sessionData;
    }

    if (session.expiresAt && new Date() > session.expiresAt) {
      this.clearAll();
      return false;
    }

    return true;
  }

  saveUser(user: User): void {
    this.userData = { ...user };
  }

  getUser(): User | null {
    if (!this.userData) return null;

    // Check if we have a valid session for this user
    const session = this.getSession();
    if (!session || session.userId !== this.userData.id) {
      this.clearUser();
      return null;
    }

    return this.userData;
  }

  clearUser(): void {
    this.userData = null;
  }

  clearAll(): void {
    this.sessionData = null;
    this.userData = null;
  }

  destroy(): void {
    // Nothing to clean up for memory storage
  }
}

/**
 * Storage factory - creates appropriate storage based on environment
 */
export function createSessionStorage(): SessionStorage {
  // Check if localStorage is available
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return new LocalSessionStorage();
    }
  } catch (error) {
    console.warn('localStorage not available, falling back to memory storage:', error);
  }

  return new MemorySessionStorage();
}

/**
 * Utility to generate session IDs
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Utility to create default session info
 */
export function createSessionInfo(
  user: User,
  expirationHours: number = 24
): SessionInfo {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expirationHours * 60 * 60 * 1000);

  return {
    userId: user.id,
    email: user.email,
    expiresAt,
    authProvider: user.authProvider,
    sessionId: generateSessionId(),
    createdAt: now,
  };
}

/**
 * Storage event listener for cross-tab synchronization
 */
export function setupStorageEventListeners(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleStorageChange = (event: StorageEvent) => {
    // If session or user data changes in another tab, update current tab
    if (event.key === SESSION_KEY || event.key === USER_KEY) {
      window.dispatchEvent(new CustomEvent('auth:storage-changed', {
        detail: { key: event.key, newValue: event.newValue }
      }));
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}

/**
 * Singleton session storage instance
 */
let defaultStorage: SessionStorage | null = null;

export function getSessionStorage(): SessionStorage {
  if (!defaultStorage) {
    defaultStorage = createSessionStorage();
  }
  return defaultStorage;
}

/**
 * Clean up session storage (call on app unmount)
 */
export function cleanupSessionStorage(): void {
  if (defaultStorage && 'destroy' in defaultStorage) {
    (defaultStorage as LocalSessionStorage).destroy();
    defaultStorage = null;
  }
}