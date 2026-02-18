'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, AuthResult } from '../types/auth';
import { SimpleAuthProvider } from '../providers/SimpleAuthProvider';
import { getStoredUser, hasSession, clearStoredUser, saveUser } from '../utils/storage';
import { findUserById } from '../utils/database';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;       // True during auth operations (login/register)
  isInitializing: boolean;  // True only during initial session check on mount
  isAuthenticated: boolean;
  error: string | null;
  register: (name: string, email: string, team: string) => Promise<AuthResult>;
  login: (email: string) => Promise<AuthResult>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const provider = new SimpleAuthProvider();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      if (hasSession()) {
        const stored = getStoredUser();
        if (stored) {
          const fresh = await findUserById(stored.id);
          if (fresh) {
            saveUser(fresh);
            setUser(fresh);
          } else {
            clearStoredUser();
          }
        }
      }
      setIsInitializing(false);
    };
    loadSession();
  }, []);

  const register = useCallback(async (name: string, email: string, team: string): Promise<AuthResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await provider.register(name, email, team);
      if (result.success && result.user) {
        setUser(result.user);
      } else if (result.error) {
        setError(result.error);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string): Promise<AuthResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await provider.login(email);
      if (result.success && result.user) {
        setUser(result.user);
      } else if (result.error && result.error !== 'STUB_ACCOUNT') {
        setError(result.error);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    provider.logout();
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const handleSetUser = useCallback((u: User) => {
    saveUser(u);
    setUser(u);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isInitializing,
      isAuthenticated: !!user,
      error,
      register,
      login,
      logout,
      clearError,
      setUser: handleSetUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
