/**
 * useAuthProvider Hook
 *
 * Hook for managing authentication providers and their capabilities.
 * Useful for provider switching and configuration UI.
 */

'use client';

import { useMemo, useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';
import {
  AuthProvider,
  AuthProviderType,
  AuthCapabilities,
} from '../types/auth';

export interface UseAuthProviderReturn {
  // Current provider info
  currentProvider: AuthProvider | null;
  currentProviderType: AuthProviderType | null;
  currentProviderName: string | null;

  // Available providers
  availableProviders: AuthProviderType[];

  // Provider capabilities
  capabilities: AuthCapabilities | null;

  // Provider switching
  switchProvider: (type: AuthProviderType) => Promise<void>;
  canSwitchProvider: boolean;

  // Provider checks
  isProviderType: (type: AuthProviderType) => boolean;
  supportsFeature: (feature: keyof AuthCapabilities) => boolean;

  // Rate limiting (for SimpleAuthProvider)
  getRateLimitInfo?: (email: string) => {
    isLimited: boolean;
    remainingAttempts: number;
    resetTime: number | null;
  };
}

/**
 * Hook for auth provider management
 */
export function useAuthProvider(): UseAuthProviderReturn {
  const {
    authProvider,
    getAvailableProviders,
    switchProvider,
  } = useAuthContext();

  // Current provider info
  const currentProvider = useMemo(() => authProvider, [authProvider]);

  const currentProviderType = useMemo(() => {
    return authProvider?.type || null;
  }, [authProvider]);

  const currentProviderName = useMemo(() => {
    return authProvider?.name || null;
  }, [authProvider]);

  // Available providers
  const availableProviders = useMemo(() => {
    return getAvailableProviders();
  }, [getAvailableProviders]);

  // Provider capabilities
  const capabilities = useMemo(() => {
    return authProvider?.getCapabilities() || null;
  }, [authProvider]);

  // Provider switching capability
  const canSwitchProvider = useMemo(() => {
    return capabilities?.canSwitchProviders === true && availableProviders.length > 1;
  }, [capabilities, availableProviders]);

  // Provider checks
  const isProviderType = useCallback((type: AuthProviderType) => {
    return currentProviderType === type;
  }, [currentProviderType]);

  const supportsFeature = useCallback((feature: keyof AuthCapabilities) => {
    return capabilities?.[feature] === true;
  }, [capabilities]);

  // Rate limiting info (specific to SimpleAuthProvider)
  const getRateLimitInfo = useMemo(() => {
    if (isProviderType('simple') && authProvider && 'getRateLimitInfo' in authProvider) {
      return (authProvider as any).getRateLimitInfo.bind(authProvider);
    }
    return undefined;
  }, [authProvider, isProviderType]);

  return {
    // Current provider
    currentProvider,
    currentProviderType,
    currentProviderName,

    // Available providers
    availableProviders,

    // Capabilities
    capabilities,

    // Switching
    switchProvider,
    canSwitchProvider,

    // Checks
    isProviderType,
    supportsFeature,

    // Provider-specific features
    getRateLimitInfo,
  };
}