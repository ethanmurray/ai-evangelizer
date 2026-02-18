import { User } from '../types/auth';

const USER_KEY = 'cult_of_ai_user';
const SESSION_KEY = 'cult_of_ai_session';

export function saveUser(user: User): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify({
      ...user,
      createdAt: user.createdAt.toISOString(),
    }));
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      userId: user.id,
      createdAt: new Date().toISOString(),
    }));
  } catch {
    // localStorage not available
  }
}

export function getStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    const data = JSON.parse(stored);
    return {
      ...data,
      createdAt: new Date(data.createdAt),
    };
  } catch {
    return null;
  }
}

export function clearStoredUser(): void {
  try {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // localStorage not available
  }
}

export function hasSession(): boolean {
  try {
    return localStorage.getItem(SESSION_KEY) !== null;
  } catch {
    return false;
  }
}
