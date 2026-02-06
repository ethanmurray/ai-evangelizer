/**
 * UserProfile Component
 *
 * Displays user information and provides logout functionality
 */

'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useAuth, useUser } from '@/lib/auth';

export interface UserProfileProps {
  className?: string;
  showFullProfile?: boolean;
  onLogout?: () => void;
}

export function UserProfile({
  className = '',
  showFullProfile = false,
  onLogout
}: UserProfileProps) {
  const { logout, isLoading } = useAuth();
  const {
    user,
    fullName,
    initials,
    email,
    memberSince,
    authProviderName
  } = useUser();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      onLogout?.();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return null;
  }

  if (!showFullProfile) {
    // Compact profile for headers/navbars
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {/* Avatar */}
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
          {initials}
        </div>

        {/* Name */}
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {fullName}
        </span>

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          isLoading={isLoggingOut}
          loadingText="..."
          className="text-xs"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  // Full profile view
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        {/* Large Avatar */}
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
          {initials}
        </div>

        {/* User Info */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {fullName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {email}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Member Since
          </span>
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {memberSince ? new Date(memberSince).toLocaleDateString() : 'Unknown'}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Authentication
          </span>
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {authProviderName || 'Simple Email'}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Account Status
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            Active
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full"
          disabled
        >
          Edit Profile
          <span className="text-xs text-gray-500 ml-2">(Coming Soon)</span>
        </Button>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleLogout}
          isLoading={isLoggingOut || isLoading}
          loadingText="Signing Out..."
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}