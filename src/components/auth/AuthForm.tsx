'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { validateEmail, validateName, validateTeam } from '@/lib/auth/utils/validation';
import { listTeams } from '@/lib/auth/utils/database';

export interface AuthFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function AuthForm({ onSuccess, className = '' }: AuthFormProps) {
  const { register, login, isLoading, error, clearError, setUser } = useAuth();
  const { t } = useTheme();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [teams, setTeams] = useState<string[]>([]);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [mode, setMode] = useState<'email' | 'register' | 'stub-convert' | 'check-email'>('email');
  const [stubInfo, setStubInfo] = useState<{ id: string; email: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    listTeams().then(setTeams);
  }, []);

  useEffect(() => {
    clearError();
    setFieldErrors({});
  }, [email, name, team, clearError]);

  const handleEmailContinue = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setFieldErrors({ email: 'Please enter a valid email address' });
      return;
    }

    const result = await login(email);
    if (result.pendingVerification) {
      setMode('check-email');
    } else if (result.success) {
      onSuccess?.();
    } else if (result.error === 'STUB_ACCOUNT') {
      setStubInfo({ id: '', email });
      setMode('stub-convert');
    } else if (result.error === 'No account found with this email') {
      setMode('register');
    }
  }, [email, login, onSuccess]);

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!validateName(name)) errors.name = 'Name is required';
    if (!validateEmail(email)) errors.email = 'Valid email required';
    if (!validateTeam(team)) errors.team = 'Team is required';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const result = await register(name, email, team);
    if (result.pendingVerification) {
      setMode('check-email');
    } else if (result.success) {
      onSuccess?.();
    }
  }, [name, email, team, register, onSuccess]);

  const handleStubConvert = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!validateName(name)) errors.name = 'Name is required';
    if (!validateTeam(team)) errors.team = 'Team is required';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const result = await register(name, email, team);
    if (result.pendingVerification) {
      setMode('check-email');
    } else if (result.success) {
      onSuccess?.();
    }
  }, [name, email, team, register, onSuccess]);

  const filteredTeams = teams.filter((t) =>
    t.toLowerCase().includes(team.toLowerCase())
  );

  const resetForm = () => {
    setMode('email');
    setName('');
    setTeam('');
    setFieldErrors({});
    clearError();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-heading)' }}>
          {mode === 'email' && t.concepts.login}
          {mode === 'register' && `${t.concepts.login}`}
          {mode === 'stub-convert' && 'Complete Your Account'}
          {mode === 'check-email' && t.microcopy.checkEmailTitle}
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {mode === 'email' && t.microcopy.loginSubtext}
          {mode === 'register' && t.tagline}
          {mode === 'stub-convert' && t.microcopy.stubAccountWelcome.replace('{count}', 'some')}
          {mode === 'check-email' && t.microcopy.checkEmailBody.replace('{email}', email)}
        </p>
      </div>

      {error && error !== 'STUB_ACCOUNT' && (
        <Alert variant="error" onClose={clearError}>{error}</Alert>
      )}

      {/* Email Step */}
      {mode === 'email' && (
        <form onSubmit={handleEmailContinue} className="space-y-4" noValidate>
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email (honor system please!)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            required
          />
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)', opacity: 0.8 }}>
            This is an entirely vibe-coded, unreviewed, unsecured public-data-only app. Don't put anything sensitive here. We will add very basic authentication soon and real security someday.
          </p>
          <Button type="submit" className="w-full" isLoading={isLoading} loadingText="Checking...">
            Continue
          </Button>
        </form>
      )}

      {/* Registration */}
      {(mode === 'register' || mode === 'stub-convert') && (
        <form onSubmit={mode === 'register' ? handleRegister : handleStubConvert} className="space-y-4" noValidate>
          <Input
            type="email"
            label="Email"
            value={email}
            disabled
          />

          <Input
            type="text"
            label="Your Name"
            placeholder="Jane Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name}
            required
          />

          {/* Team combo box */}
          <div className="space-y-1">
            <label className="block text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
              Team
            </label>
            <div className="relative">
              <input
                type="text"
                className="block w-full rounded-lg border px-3 py-2"
                style={{
                  background: 'var(--color-bg-surface)',
                  color: 'var(--color-text)',
                  borderColor: fieldErrors.team ? 'var(--color-error)' : 'var(--color-border)',
                }}
                placeholder="Type or select a team"
                value={team}
                onChange={(e) => {
                  setTeam(e.target.value);
                  setShowTeamDropdown(true);
                }}
                onFocus={() => setShowTeamDropdown(true)}
                onBlur={() => setTimeout(() => setShowTeamDropdown(false), 200)}
              />
              {showTeamDropdown && filteredTeams.length > 0 && (
                <div
                  className="absolute z-10 w-full mt-1 rounded-lg border shadow-lg max-h-40 overflow-y-auto"
                  style={{
                    background: 'var(--color-bg-elevated)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  {filteredTeams.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="block w-full text-left px-3 py-2 text-sm hover:opacity-80"
                      style={{ color: 'var(--color-text)' }}
                      onMouseDown={() => {
                        setTeam(t);
                        setShowTeamDropdown(false);
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {fieldErrors.team && (
              <p className="text-sm" style={{ color: 'var(--color-error)' }}>{fieldErrors.team}</p>
            )}
          </div>

          <div className="space-y-3">
            <Button type="submit" className="w-full" isLoading={isLoading} loadingText="Creating Account...">
              {mode === 'stub-convert' ? 'Complete Account' : 'Create Account'}
            </Button>
            <Button type="button" variant="ghost" onClick={resetForm} className="w-full">
              Use Different Email
            </Button>
          </div>
        </form>
      )}

      {/* Check Email */}
      {mode === 'check-email' && (
        <div className="text-center space-y-4">
          <div className="text-4xl">&#x2709;&#xFE0F;</div>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)', opacity: 0.7 }}>
            {t.microcopy.checkEmailExpiry}
          </p>
          <Button type="button" variant="ghost" onClick={resetForm} className="w-full">
            Use Different Email
          </Button>
        </div>
      )}
    </div>
  );
}
