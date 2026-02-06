/**
 * Authentication Context
 *
 * Provides authentication state and operations throughout the React application.
 * Supports multiple auth providers through a unified interface.
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type {
  AuthProvider as IAuthProvider,
  AuthProviderType,
  User,
  UserRegistrationData,
  UserProfile,
  AuthResult,
  AuthError,
  SessionInfo,
} from '../types/auth';
import { SimpleAuthProvider } from '../providers/SimpleAuthProvider';

// Context type definition
export interface AuthContextType {
  // Current state
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authProvider: IAuthProvider | null;
  error: AuthError | null;

  // Authentication actions
  register: (userData: UserRegistrationData) => Promise<AuthResult>;
  login: (email: string, password?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<UserProfile>) => Promise<AuthResult>;
  refreshSession: () => Promise<AuthResult>;

  // Provider management
  switchProvider: (providerType: AuthProviderType) => Promise<void>;
  getAvailableProviders: () => AuthProviderType[];

  // Utility methods
  clearError: () => void;
  getSessionInfo: () => SessionInfo | null;
}

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props interface
export interface AuthProviderProps {
  children: React.ReactNode;
  defaultProvider?: AuthProviderType;
  config?: {
    sessionTimeoutHours?: number;
    enableDebug?: boolean;
    rateLimit?: {
      maxAttempts: number;
      windowMs: number;
    };
  };
}

/**
 * Auth Provider Factory
 * Creates the appropriate auth provider based on type
 */
function createAuthProvider(type: AuthProviderType, config?: any): IAuthProvider {
  switch (type) {
    case 'simple':
      return new SimpleAuthProvider({
        sessionTimeoutHours: config?.sessionTimeoutHours,
        rateLimit: config?.rateLimit,
        debug: config?.enableDebug,
      });

    case 'supabase':
      // TODO: Implement SupabaseAuthProvider in Phase 2
      throw new Error('Supabase auth provider not yet implemented');

    case 'okta':
      // TODO: Implement OktaAuthProvider in Phase 3
      throw new Error('Okta auth provider not yet implemented');

    default:
      throw new Error(`Unsupported auth provider type: ${type}`);
  }
}

/**
 * Authentication Provider Component
 */
export function AuthProvider({ children, defaultProvider = 'simple', config }: AuthProviderProps) {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authProvider, setAuthProvider] = useState<IAuthProvider | null>(null);
  const [error, setError] = useState<AuthError | null>(null);

  // Initialize auth provider
  useEffect(() => {
    try {
      const provider = createAuthProvider(defaultProvider, config);
      setAuthProvider(provider);
    } catch (err) {
      console.error('Failed to initialize auth provider:', err);
      setError({
        code: 'PROVIDER_CONFIGURATION_ERROR' as any,
        message: 'Failed to initialize authentication system',
        details: err,
      });
      setIsLoading(false);
    }
  }, [defaultProvider, config]);

  // Load existing session on mount
  useEffect(() => {
    if (!authProvider) return;

    const loadExistingSession = async () => {
      try {
        setIsLoading(true);

        // Check for existing session
        if (authProvider.isAuthenticated()) {
          const currentUser = await authProvider.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Session exists but user is invalid, refresh
            const refreshResult = await authProvider.refreshSession();
            if (refreshResult.success && refreshResult.user) {
              setUser(refreshResult.user);
            } else {
              // Clear invalid session
              await authProvider.logout();
            }
          }
        }
      } catch (err) {
        console.error('Error loading existing session:', err);
        // Don't set error for session loading failures
        await authProvider.logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingSession();
  }, [authProvider]);

  // Listen for storage changes (cross-tab synchronization)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event: CustomEvent) => {
      if (event.detail?.key === 'ai_evangelizer_session') {
        // Session changed in another tab, refresh current state
        refreshSession();
      }
    };

    const handleSessionExpired = () => {
      // Session expired, clear state
      setUser(null);
      setError({
        code: 'SESSION_EXPIRED' as any,
        message: 'Your session has expired. Please sign in again.',
      });
    };

    window.addEventListener('auth:storage-changed', handleStorageChange as EventListener);
    window.addEventListener('auth:session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('auth:storage-changed', handleStorageChange as EventListener);
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, []);

  // Authentication actions
  const register = useCallback(async (userData: UserRegistrationData): Promise<AuthResult> => {
    if (!authProvider) {
      const error = {
        code: 'PROVIDER_NOT_AVAILABLE' as any,
        message: 'Authentication provider not available',
      };
      setError(error);
      return { success: false, error };
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await authProvider.register(userData);

      if (result.success && result.user) {
        setUser(result.user);
      } else if (result.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const error = {
        code: 'SERVER_ERROR' as any,
        message: 'Registration failed due to an unexpected error',
        details: err,
      };
      setError(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [authProvider]);

  const login = useCallback(async (email: string, password?: string): Promise<AuthResult> => {
    if (!authProvider) {
      const error = {
        code: 'PROVIDER_NOT_AVAILABLE' as any,
        message: 'Authentication provider not available',
      };
      setError(error);
      return { success: false, error };
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await authProvider.login(email, password);

      if (result.success && result.user) {
        setUser(result.user);
      } else if (result.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const error = {
        code: 'SERVER_ERROR' as any,
        message: 'Login failed due to an unexpected error',
        details: err,
      };
      setError(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [authProvider]);

  const logout = useCallback(async (): Promise<void> => {
    if (!authProvider) return;

    try {
      setIsLoading(true);
      await authProvider.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Always clear user state even if logout fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [authProvider]);

  const updateUser = useCallback(async (userData: Partial<UserProfile>): Promise<AuthResult> => {
    if (!authProvider) {
      const error = {
        code: 'PROVIDER_NOT_AVAILABLE' as any,
        message: 'Authentication provider not available',
      };
      setError(error);
      return { success: false, error };
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await authProvider.updateUser(userData);

      if (result.success && result.user) {
        setUser(result.user);
      } else if (result.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const error = {
        code: 'SERVER_ERROR' as any,
        message: 'Failed to update profile',
        details: err,
      };
      setError(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [authProvider]);

  const refreshSession = useCallback(async (): Promise<AuthResult> => {
    if (!authProvider) {
      const error = {
        code: 'PROVIDER_NOT_AVAILABLE' as any,
        message: 'Authentication provider not available',
      };
      setError(error);
      return { success: false, error };
    }

    try {
      const result = await authProvider.refreshSession();

      if (result.success && result.user) {
        setUser(result.user);
        setError(null);
      } else if (result.error) {
        setError(result.error);
        setUser(null);
      }

      return result;
    } catch (err) {
      const error = {
        code: 'SERVER_ERROR' as any,
        message: 'Failed to refresh session',
        details: err,
      };
      setError(error);
      setUser(null);
      return { success: false, error };
    }
  }, [authProvider]);

  // Provider management
  const switchProvider = useCallback(async (providerType: AuthProviderType): Promise<void> => {
    try {
      setIsLoading(true);

      // Logout from current provider
      if (authProvider) {
        await authProvider.logout();
      }

      // Clear current state
      setUser(null);
      setError(null);

      // Create new provider
      const newProvider = createAuthProvider(providerType, config);
      setAuthProvider(newProvider);

    } catch (err) {
      console.error('Error switching auth provider:', err);
      setError({
        code: 'PROVIDER_CONFIGURATION_ERROR' as any,
        message: `Failed to switch to ${providerType} authentication`,
        details: err,
      });
    } finally {
      setIsLoading(false);
    }
  }, [authProvider, config]);

  const getAvailableProviders = useCallback((): AuthProviderType[] => {
    // For Phase 1, only simple auth is available
    // This will be expanded in future phases
    return ['simple'];
  }, []);

  // Utility methods
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getSessionInfo = useCallback((): SessionInfo | null => {
    return authProvider?.getSessionInfo() || null;
  }, [authProvider]);

  // Computed values
  const isAuthenticated = Boolean(user && authProvider?.isAuthenticated());

  // Context value
  const contextValue: AuthContextType = {
    // State
    user,
    isLoading,
    isAuthenticated,
    authProvider,
    error,

    // Actions
    register,
    login,
    logout,
    updateUser,
    refreshSession,

    // Provider management
    switchProvider,
    getAvailableProviders,

    // Utilities
    clearError,
    getSessionInfo,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}

/**
 * Higher-order component for auth protection
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    redirectTo?: string;
    requiredAuth?: boolean;
  } = {}
) {
  const { requiredAuth = true } = options;

  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
      return <div>Loading...</div>; // Replace with your loading component
    }

    if (requiredAuth && !isAuthenticated) {
      // Handle redirect logic here
      return <div>Please sign in to access this page.</div>;
    }

    return <Component {...props} />;
  };
}