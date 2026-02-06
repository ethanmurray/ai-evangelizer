/**
 * AuthForm Component
 *
 * Combined registration and login form that switches modes intelligently
 * based on whether the email already exists in the system.
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { useAuth } from '@/lib/auth';
import { validateEmail, validateName } from '@/lib/auth/utils/validation';

export interface AuthFormProps {
  onSuccess?: (user: any) => void;
  onModeChange?: (mode: 'register' | 'login') => void;
  className?: string;
  showTerms?: boolean;
}

export function AuthForm({
  onSuccess,
  onModeChange,
  className = '',
  showTerms = true
}: AuthFormProps) {
  // Form state
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // UI state
  const [mode, setMode] = useState<'email' | 'register' | 'login'>('email');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Auth hook
  const {
    register,
    login,
    isLoading,
    error,
    clearError,
    loginWithFeedback,
    registerWithFeedback
  } = useAuth();

  // Clear errors when inputs change
  useEffect(() => {
    if (error) {
      clearError();
    }
    setFieldErrors({});
    setSuccessMessage('');
  }, [email, firstName, lastName, clearError, error]);

  // Notify parent of mode changes
  useEffect(() => {
    if (mode !== 'email' && onModeChange) {
      onModeChange(mode);
    }
  }, [mode, onModeChange]);

  // Validate individual fields
  const validateField = useCallback((field: string, value: string): string => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email address';
        return '';
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (!validateName(value)) return 'First name must be 1-50 characters';
        return '';
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (!validateName(value)) return 'Last name must be 1-50 characters';
        return '';
      default:
        return '';
    }
  }, []);

  // Handle email continuation (check if user exists)
  const handleEmailContinue = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateField('email', email);
    if (emailError) {
      setFieldErrors({ email: emailError });
      return;
    }

    setIsCheckingEmail(true);
    clearError();

    try {
      // Try to login first (this will tell us if user exists)
      const result = await login(email);

      if (result.success) {
        // User exists and logged in successfully
        setMode('login');
        setSuccessMessage(`Welcome back! You've been signed in.`);
        onSuccess?.(result.user);
      } else if (result.error?.code === 'USER_NOT_FOUND') {
        // User doesn't exist, show registration form
        setMode('register');
      } else {
        // Some other error occurred
        setMode('login');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      // Default to registration mode on error
      setMode('register');
    } finally {
      setIsCheckingEmail(false);
    }
  }, [email, login, clearError, onSuccess, validateField]);

  // Handle registration
  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const errors: Record<string, string> = {};

    const emailError = validateField('email', email);
    if (emailError) errors.email = emailError;

    const firstNameError = validateField('firstName', firstName);
    if (firstNameError) errors.firstName = firstNameError;

    const lastNameError = validateField('lastName', lastName);
    if (lastNameError) errors.lastName = lastNameError;

    if (showTerms && !agreedToTerms) {
      errors.terms = 'You must agree to the terms and conditions';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Attempt registration
    const result = await registerWithFeedback({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      agreedToTerms,
    });

    if (result.success) {
      setSuccessMessage(result.message);
      onSuccess?.(result.result?.user);
    }
  }, [
    email,
    firstName,
    lastName,
    agreedToTerms,
    showTerms,
    registerWithFeedback,
    onSuccess,
    validateField
  ]);

  // Handle login (for existing users)
  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateField('email', email);
    if (emailError) {
      setFieldErrors({ email: emailError });
      return;
    }

    const result = await loginWithFeedback(email);

    if (result.success) {
      setSuccessMessage(result.message);
      onSuccess?.(result.result?.user);
    }
  }, [email, loginWithFeedback, onSuccess, validateField]);

  // Reset form to email input
  const resetForm = useCallback(() => {
    setMode('email');
    setFirstName('');
    setLastName('');
    setAgreedToTerms(false);
    setFieldErrors({});
    setSuccessMessage('');
    clearError();
  }, [clearError]);

  // Show success message
  if (successMessage) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Alert variant="success" title="Success!">
          {successMessage}
        </Alert>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {mode === 'email' && 'Welcome to AI Evangelizer'}
          {mode === 'register' && 'Create Your Account'}
          {mode === 'login' && 'Welcome Back'}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {mode === 'email' && 'Enter your email to get started'}
          {mode === 'register' && 'Just a few details to create your account'}
          {mode === 'login' && 'Sign in to access your leaderboard'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={clearError}>
          {error.message || 'An unexpected error occurred'}
        </Alert>
      )}

      {/* Email Step */}
      {mode === 'email' && (
        <form onSubmit={handleEmailContinue} className="space-y-4" noValidate>
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            required
            icon={
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0021.75 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            }
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isCheckingEmail}
            loadingText="Checking..."
          >
            Continue
          </Button>
        </form>
      )}

      {/* Registration Form */}
      {mode === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4" noValidate>
          <Input
            type="email"
            label="Email Address"
            value={email}
            disabled
            icon={
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0021.75 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              label="First Name"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={fieldErrors.firstName}
              required
              icon={
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              }
            />

            <Input
              type="text"
              label="Last Name"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={fieldErrors.lastName}
              required
              icon={
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              }
            />
          </div>

          {showTerms && (
            <div className="space-y-2">
              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {fieldErrors.terms && (
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {fieldErrors.terms}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              loadingText="Creating Account..."
            >
              Create Account
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={resetForm}
              className="w-full"
            >
              Use Different Email
            </Button>
          </div>
        </form>
      )}

      {/* Login Form */}
      {mode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          <Input
            type="email"
            label="Email Address"
            value={email}
            disabled
            icon={
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0021.75 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            }
          />

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              loadingText="Signing In..."
            >
              Sign In
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={resetForm}
              className="w-full"
            >
              Use Different Email
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}