export interface User {
  id: string;
  name: string;
  email: string;
  team: string;
  teams?: string[];
  isStub: boolean;
  isAdmin: boolean;
  createdAt: Date;
  themePreference: string | null;
  emailOptIn: boolean;
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
  email_opt_in: boolean;
}
