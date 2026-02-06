/**
 * Database utilities for user management
 *
 * Provides consistent database operations for user profiles
 * across all authentication providers.
 */

import { supabase } from '../../supabase';
import {
  User,
  UserProfile,
  UserProfileRow,
  UserRegistrationData,
  AuthError,
  AuthErrorCode,
} from '../types/auth';

/**
 * Transform database row to User object
 */
export function userFromRow(row: UserProfileRow): User {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    authProvider: row.auth_provider as any,
    externalAuthId: row.external_auth_id || undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    lastSeen: new Date(row.last_seen),
    isActive: row.is_active,
  };
}

/**
 * Transform User object to database row format
 */
export function userToRow(user: Partial<User>): Partial<UserProfileRow> {
  const row: Partial<UserProfileRow> = {};

  if (user.id) row.id = user.id;
  if (user.email) row.email = user.email;
  if (user.firstName) row.first_name = user.firstName;
  if (user.lastName) row.last_name = user.lastName;
  if (user.authProvider) row.auth_provider = user.authProvider;
  if (user.externalAuthId !== undefined) row.external_auth_id = user.externalAuthId;
  if (user.isActive !== undefined) row.is_active = user.isActive;

  return row;
}

/**
 * Create a new user profile in the database
 */
export async function createUserProfile(
  userData: UserRegistrationData,
  authProvider: string = 'simple',
  externalAuthId?: string
): Promise<User> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        email: userData.email.toLowerCase().trim(),
        first_name: userData.firstName.trim(),
        last_name: userData.lastName.trim(),
        auth_provider: authProvider,
        external_auth_id: externalAuthId,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error creating user:', error);

      // Handle specific database errors
      if (error.code === '23505' && error.message.includes('email')) {
        throw new Error('EMAIL_ALREADY_EXISTS');
      }

      throw new Error('DATABASE_ERROR');
    }

    return userFromRow(data);
  } catch (error) {
    console.error('Error creating user profile:', error);

    if (error instanceof Error) {
      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        throw {
          code: AuthErrorCode.EMAIL_ALREADY_EXISTS,
          message: 'An account with this email already exists',
        } as AuthError;
      }
    }

    throw {
      code: AuthErrorCode.DATABASE_ERROR,
      message: 'Failed to create user account',
      details: error,
    } as AuthError;
  }
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('is_active', true)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 rows gracefully

    if (error) {
      console.error('Database error finding user:', error);
      throw new Error('DATABASE_ERROR');
    }

    // maybeSingle() returns null when no rows found
    if (!data) {
      return null;
    }

    return userFromRow(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'DATABASE_ERROR') {
      throw {
        code: AuthErrorCode.DATABASE_ERROR,
        message: 'Failed to find user',
        details: error,
      } as AuthError;
    }

    return null;
  }
}

/**
 * Find user by ID
 */
export async function findUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Database error finding user by ID:', error);
      throw new Error('DATABASE_ERROR');
    }

    if (!data) {
      return null;
    }

    return userFromRow(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'DATABASE_ERROR') {
      throw {
        code: AuthErrorCode.DATABASE_ERROR,
        message: 'Failed to find user',
        details: error,
      } as AuthError;
    }

    return null;
  }
}

/**
 * Find user by external auth ID (for Supabase/Okta integration)
 */
export async function findUserByExternalAuthId(
  externalAuthId: string,
  authProvider: string
): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('external_auth_id', externalAuthId)
      .eq('auth_provider', authProvider)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Database error finding user by external auth ID:', error);
      throw new Error('DATABASE_ERROR');
    }

    if (!data) {
      return null;
    }

    return userFromRow(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'DATABASE_ERROR') {
      throw {
        code: AuthErrorCode.DATABASE_ERROR,
        message: 'Failed to find user',
        details: error,
      } as AuthError;
    }

    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<User> {
  try {
    const updateData = userToRow({
      firstName: updates.firstName,
      lastName: updates.lastName,
      // Add other updateable fields here
    });

    // Add updated_at timestamp
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .eq('is_active', true)
      .select()
      .single();

    if (error) {
      console.error('Database error updating user:', error);
      throw new Error('DATABASE_ERROR');
    }

    return userFromRow(data);
  } catch (error) {
    throw {
      code: AuthErrorCode.DATABASE_ERROR,
      message: 'Failed to update user profile',
      details: error,
    } as AuthError;
  }
}

/**
 * Update user's last seen timestamp
 */
export async function updateUserLastSeen(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        last_seen: new Date().toISOString(),
      })
      .eq('id', userId)
      .eq('is_active', true);

    if (error) {
      console.error('Database error updating last seen:', error);
      // Don't throw error for last seen updates, just log
    }
  } catch (error) {
    console.error('Failed to update user last seen:', error);
    // Don't throw error for last seen updates
  }
}

/**
 * Link user to external auth provider (for migration)
 */
export async function linkUserToExternalAuth(
  userId: string,
  externalAuthId: string,
  authProvider: string
): Promise<User> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        external_auth_id: externalAuthId,
        auth_provider: authProvider,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .eq('is_active', true)
      .select()
      .single();

    if (error) {
      console.error('Database error linking external auth:', error);
      throw new Error('DATABASE_ERROR');
    }

    return userFromRow(data);
  } catch (error) {
    throw {
      code: AuthErrorCode.DATABASE_ERROR,
      message: 'Failed to link external authentication',
      details: error,
    } as AuthError;
  }
}

/**
 * Deactivate user account (soft delete)
 */
export async function deactivateUser(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Database error deactivating user:', error);
      throw new Error('DATABASE_ERROR');
    }
  } catch (error) {
    throw {
      code: AuthErrorCode.DATABASE_ERROR,
      message: 'Failed to deactivate user account',
      details: error,
    } as AuthError;
  }
}

/**
 * Get user count for analytics
 */
export async function getUserCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (error) {
      console.error('Database error getting user count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Failed to get user count:', error);
    return 0;
  }
}

/**
 * Check if user is in early adopter list (for badge awarding)
 */
export async function isEarlyAdopter(userId: string): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .lt('created_at', (await findUserById(userId))?.createdAt?.toISOString() || '');

    if (error) {
      console.error('Database error checking early adopter status:', error);
      return false;
    }

    // Early adopter if among first 100 users
    return (count || 999) < 100;
  } catch (error) {
    console.error('Failed to check early adopter status:', error);
    return false;
  }
}

/**
 * Batch operations for efficient data handling
 */
export class BatchUserOperations {
  private operations: Promise<any>[] = [];

  /**
   * Add update last seen operation to batch
   */
  addUpdateLastSeen(userId: string): void {
    this.operations.push(updateUserLastSeen(userId));
  }

  /**
   * Execute all batched operations
   */
  async execute(): Promise<void> {
    if (this.operations.length === 0) return;

    try {
      await Promise.allSettled(this.operations);
    } catch (error) {
      console.error('Error executing batch operations:', error);
    } finally {
      this.operations = [];
    }
  }
}

/**
 * Database health check
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);

    return !error;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}