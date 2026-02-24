import { AuthResult, User } from '../types/auth';
import { findUserByEmail, createUser, convertStubUser } from '../utils/database';
import { clearStoredUser, getStoredUser, saveUser } from '../utils/storage';

export class SimpleAuthProvider {
  async register(name: string, email: string, team: string): Promise<AuthResult> {
    try {
      const existing = await findUserByEmail(email);

      if (existing && !existing.isStub) {
        return { success: false, error: 'An account with this email already exists. Try signing in.' };
      }

      let user: User;
      if (existing && existing.isStub) {
        user = await convertStubUser(email, name, team);
      } else {
        user = await createUser(name, email, team);
      }

      // TODO: Re-enable magic link verification once email delivery works
      // For now, log the user in directly
      saveUser(user);
      return { success: true, user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  }

  async login(email: string): Promise<AuthResult> {
    try {
      const user = await findUserByEmail(email);
      if (!user) {
        return { success: false, error: 'No account found with this email' };
      }

      if (user.isStub) {
        return { success: false, error: 'STUB_ACCOUNT' };
      }

      // TODO: Re-enable magic link verification once email delivery works
      // For now, log the user in directly
      saveUser(user);
      return { success: true, user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }

  logout(): void {
    clearStoredUser();
  }

  getCurrentUser(): User | null {
    return getStoredUser();
  }
}
