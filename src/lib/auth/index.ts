export { AuthProvider, useAuthContext } from './context/AuthContext';
export type { AuthContextType } from './context/AuthContext';
export { useAuth } from './hooks/useAuth';
export { useUser } from './hooks/useUser';
export type { User, AuthResult, UserRow } from './types/auth';
export { validateEmail, validateName, validateTeam, validateRegistration } from './utils/validation';
export { updateUserTheme, updateUserTeam } from './utils/database';
