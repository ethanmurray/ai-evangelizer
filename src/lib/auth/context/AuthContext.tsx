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
  verifyAndLogin: (token: string) => Promise<AuthResult>;
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
        saveUser(result.user);
        setUser(result.user);
      } else if (result.success && result.pendingVerification) {
        // Magic link sent — don't save user yet
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
        saveUser(result.user);
        setUser(result.user);
      } else if (result.success && result.pendingVerification) {
        // Magic link sent — don't save user yet
      } else if (result.error && result.error !== 'STUB_ACCOUNT') {
        setError(result.error);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyAndLogin = useCallback(async (token: string): Promise<AuthResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/verify-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.error || 'Verification failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      const verifiedUser: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        team: data.user.team,
        isStub: data.user.isStub,
        isAdmin: data.user.isAdmin ?? false,
        createdAt: new Date(data.user.createdAt),
        themePreference: data.user.themePreference,
        emailOptIn: data.user.emailOptIn ?? true,
      };

      saveUser(verifiedUser);
      setUser(verifiedUser);
      return { success: true, user: verifiedUser };
    } catch (err: any) {
      const errorMsg = err.message || 'Verification failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
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
      verifyAndLogin,
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
