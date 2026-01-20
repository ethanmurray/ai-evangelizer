/**
 * useUser Hook
 *
 * Simplified hook for accessing user information and authentication state.
 * Perfect for components that only need to read user data.
 */

'use client';

import { useMemo } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { User } from '../types/auth';

export interface UseUserReturn {
  // Core user data
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Computed user properties
  fullName: string | null;
  initials: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;

  // User status
  isActive: boolean;
  memberSince: Date | null;
  lastSeen: Date | null;

  // Auth provider info
  authProviderName: string | null;
  authProviderType: string | null;
}

/**
 * Hook for accessing user information
 */
export function useUser(): UseUserReturn {
  const { user, isAuthenticated, isLoading, authProvider } = useAuthContext();

  // Computed user properties
  const fullName = useMemo(() => {
    if (!user) return null;
    return `${user.firstName} ${user.lastName}`.trim();
  }, [user]);

  const initials = useMemo(() => {
    if (!user) return null;
    const first = user.firstName.charAt(0).toUpperCase();
    const last = user.lastName.charAt(0).toUpperCase();
    return `${first}${last}`;
  }, [user]);

  const email = useMemo(() => user?.email || null, [user]);
  const firstName = useMemo(() => user?.firstName || null, [user]);
  const lastName = useMemo(() => user?.lastName || null, [user]);

  // User status
  const isActive = useMemo(() => user?.isActive || false, [user]);
  const memberSince = useMemo(() => user?.createdAt || null, [user]);
  const lastSeen = useMemo(() => user?.lastSeen || null, [user]);

  // Auth provider info
  const authProviderName = useMemo(() => authProvider?.name || null, [authProvider]);
  const authProviderType = useMemo(() => authProvider?.type || null, [authProvider]);

  return {
    // Core data
    user,
    isAuthenticated,
    isLoading,

    // Computed properties
    fullName,
    initials,
    email,
    firstName,
    lastName,

    // Status
    isActive,
    memberSince,
    lastSeen,

    // Provider info
    authProviderName,
    authProviderType,
  };
}