/**
 * useAuth Hook
 *
 * Primary hook for authentication operations throughout the application.
 * Provides a clean interface to auth context with additional utilities.
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useAuthContext, type AuthContextType } from '../context/AuthContext';
import type {
  UserRegistrationData,
  UserProfile,
  AuthResult,
} from '../types/auth';
import { getErrorMessage } from '../utils/validation';

// Extended hook interface with additional utilities
export interface UseAuthReturn {
  // Base AuthContextType properties
  user: AuthContextType['user'];
  isLoading: AuthContextType['isLoading'];
  isAuthenticated: AuthContextType['isAuthenticated'];
  authProvider: AuthContextType['authProvider'];
  error: AuthContextType['error'];
  register: AuthContextType['register'];
  login: AuthContextType['login'];
  logout: AuthContextType['logout'];
  updateUser: AuthContextType['updateUser'];
  refreshSession: AuthContextType['refreshSession'];
  switchProvider: AuthContextType['switchProvider'];
  getAvailableProviders: AuthContextType['getAvailableProviders'];
  clearError: AuthContextType['clearError'];
  getSessionInfo: AuthContextType['getSessionInfo'];

  // Convenience computed values
  userName: string | null;
  userInitials: string | null;
  sessionValid: boolean;

  // Enhanced action wrappers
  registerWithFeedback: (userData: UserRegistrationData) => Promise<{
    success: boolean;
    message: string;
    result?: AuthResult;
  }>;
  loginWithFeedback: (email: string, password?: string) => Promise<{
    success: boolean;
    message: string;
    result?: AuthResult;
  }>;

  // Utility methods
  getProviderCapabilities: () => any;
  isProviderAvailable: (providerType: string) => boolean;
  getErrorMessage: (error?: any) => string;
}

/**
 * Enhanced useAuth hook with additional utilities
 */
export function useAuth(): UseAuthReturn {
  const context = useAuthContext();

  // Computed values
  const userName = useMemo(() => {
    if (!context.user) return null;
    return `${context.user.firstName} ${context.user.lastName}`;
  }, [context.user]);

  const userInitials = useMemo(() => {
    if (!context.user) return null;
    const first = context.user.firstName.charAt(0).toUpperCase();
    const last = context.user.lastName.charAt(0).toUpperCase();
    return `${first}${last}`;
  }, [context.user]);

  const sessionValid = useMemo(() => {
    return context.isAuthenticated && context.authProvider?.isAuthenticated() === true;
  }, [context.isAuthenticated, context.authProvider]);

  // Enhanced action methods with user feedback
  const registerWithFeedback = useCallback(async (userData: UserRegistrationData) => {
    try {
      const result = await context.register(userData);

      if (result.success) {
        return {
          success: true,
          message: `Welcome to AI Evangelizer, ${userData.firstName}! Your account has been created.`,
          result,
        };
      } else {
        return {
          success: false,
          message: result.error ? getErrorMessage(result.error) : 'Registration failed',
          result,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'An unexpected error occurred during registration',
      };
    }
  }, [context]);

  const loginWithFeedback = useCallback(async (email: string, password?: string) => {
    try {
      const result = await context.login(email, password);

      if (result.success && result.user) {
        return {
          success: true,
          message: `Welcome back, ${result.user.firstName}!`,
          result,
        };
      } else {
        return {
          success: false,
          message: result.error ? getErrorMessage(result.error) : 'Login failed',
          result,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'An unexpected error occurred during login',
      };
    }
  }, [context]);

  // Utility methods
  const getProviderCapabilities = useCallback(() => {
    return context.authProvider?.getCapabilities() || null;
  }, [context.authProvider]);

  const isProviderAvailable = useCallback((providerType: string) => {
    const available = context.getAvailableProviders();
    return available.includes(providerType as any);
  }, [context]);

  const getErrorMessageHelper = useCallback((error?: any) => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    return getErrorMessage(error);
  }, []);

  return {
    // Pass through all context properties
    ...context,

    // Additional computed values
    userName,
    userInitials,
    sessionValid,

    // Enhanced methods
    registerWithFeedback,
    loginWithFeedback,

    // Utility methods
    getProviderCapabilities,
    isProviderAvailable,
    getErrorMessage: getErrorMessageHelper,
  };
}