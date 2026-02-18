export interface User {
  id: string;
  name: string;
  email: string;
  team: string;
  isStub: boolean;
  createdAt: Date;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  team: string;
  is_stub: boolean;
  created_at: string;
}
