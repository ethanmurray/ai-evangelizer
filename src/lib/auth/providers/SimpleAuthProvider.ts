import { AuthResult, User } from '../types/auth';
import { findUserByEmail, createUser, convertStubUser } from '../utils/database';
import { clearStoredUser, getStoredUser } from '../utils/storage';

async function sendMagicLink(userId: string, email: string, name?: string): Promise<void> {
  const response = await fetch('/api/auth/send-magic-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, email, name }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to send verification email');
  }
}

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

      // BYPASS: skip magic link email — corporate spam filters block it.
      // To re-enable: replace this line with:
      //   await sendMagicLink(user.id, email, name);
      //   return { success: true, pendingVerification: true };
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

      // BYPASS: skip magic link email — corporate spam filters block it.
      // To re-enable: replace this line with:
      //   await sendMagicLink(user.id, email, user.name);
      //   return { success: true, pendingVerification: true };
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
