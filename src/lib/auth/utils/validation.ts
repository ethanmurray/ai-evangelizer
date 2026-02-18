const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function validateName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= 100;
}

export function validateTeam(team: string): boolean {
  return team.trim().length >= 1;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateRegistration(name: string, email: string, team: string): ValidationResult {
  if (!validateName(name)) {
    return { valid: false, error: 'Name is required' };
  }
  if (!validateEmail(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  if (!validateTeam(team)) {
    return { valid: false, error: 'Team is required' };
  }
  return { valid: true };
}
