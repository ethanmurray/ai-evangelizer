'use client';

import { useAuthContext } from '../context/AuthContext';

export function useUser() {
  const { user, isAuthenticated, isLoading, isInitializing } = useAuthContext();

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitializing,
    name: user?.name ?? null,
    email: user?.email ?? null,
    team: user?.team ?? null,
    isStub: user?.isStub ?? false,
  };
}
