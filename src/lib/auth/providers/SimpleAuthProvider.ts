import { AuthResult, User } from '../types/auth';
import { findUserByEmail, createUser, convertStubUser } from '../utils/database';
import { clearStoredUser, getStoredUser } from '../utils/storage';

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

      await this.sendMagicLink(user);
      return { success: true, pendingVerification: true };
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

      await this.sendMagicLink(user);
      return { success: true, pendingVerification: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }

  private async sendMagicLink(user: User): Promise<void> {
    const response = await fetch('/api/auth/send-magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        name: user.name,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send verification email');
    }
  }

  logout(): void {
    clearStoredUser();
  }

  getCurrentUser(): User | null {
    return getStoredUser();
  }
}
