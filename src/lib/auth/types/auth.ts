export interface User {
  id: string;
  name: string;
  email: string;
  team: string;
  isStub: boolean;
  isAdmin: boolean;
  createdAt: Date;
  themePreference: 'cult' | 'corporate' | null;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  pendingVerification?: boolean;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  team: string;
  is_stub: boolean;
  is_admin: boolean;
  created_at: string;
  theme_preference: string | null;
}
