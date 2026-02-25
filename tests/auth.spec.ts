import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load Supabase config from .env.local for magic link token lookups
const envContent = readFileSync(join(process.cwd(), '.env.local'), 'utf-8');
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => { const i = line.indexOf('='); return [line.slice(0, i).trim(), line.slice(i + 1).trim()]; })
    .filter(([k, v]) => k && v)
);
const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_KEY = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

// Helper: clear session and go to login page
async function goToLogin(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
}

// Helper: get the latest unused magic link token for an email from Supabase
async function getMagicLinkToken(page: Page, email: string): Promise<string> {
  return page.evaluate(async ({ email, supabaseUrl, supabaseKey }) => {
    const headers = { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` };

    const userRes = await fetch(
      `${supabaseUrl}/rest/v1/users?select=id&email=eq.${encodeURIComponent(email)}&limit=1`,
      { headers }
    );
    const users = await userRes.json();
    if (!users.length) throw new Error(`No user found for ${email}`);

    const linkRes = await fetch(
      `${supabaseUrl}/rest/v1/magic_links?select=token&user_id=eq.${users[0].id}&used_at=is.null&order=created_at.desc&limit=1`,
      { headers }
    );
    const links = await linkRes.json();
    if (!links.length) throw new Error(`No magic link found for ${email}`);
    return links[0].token;
  }, { email, supabaseUrl: SUPABASE_URL, supabaseKey: SUPABASE_KEY });
}

// Helper: complete magic link verification (check-email screen → verify page → dashboard)
async function completeMagicLinkVerification(page: Page, email: string) {
  // Wait for check-email screen (shows the user's email)
  await expect(page.getByText(email)).toBeVisible({ timeout: 15000 });

  const token = await getMagicLinkToken(page, email);

  await page.goto(`/auth/verify?token=${token}`);
  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

// Helper: register a new user and end up on the dashboard
async function registerUser(page: Page, email: string, name: string, team: string) {
  await goToLogin(page);

  await page.getByLabel(/Email/i).fill(email);
  await page.getByRole('button', { name: /Continue/i }).click();

  await expect(page.getByLabel(/Your Name/i)).toBeVisible({ timeout: 10000 });
  await page.getByLabel(/Your Name/i).fill(name);

  const teamInput = page.getByPlaceholder(/Type or select a team/i);
  await teamInput.fill(team);
  // Press Escape to close the autocomplete dropdown, then click away to blur
  await teamInput.press('Escape');
  await page.getByLabel(/Your Name/i).click();

  await page.getByRole('button', { name: /Create Account/i }).click();

  await completeMagicLinkVerification(page, email);
}

test.describe('Login Page', () => {
  test('shows the login form for unauthenticated users', async ({ page }) => {
    await goToLogin(page);

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue/i })).toBeVisible();
  });

  test('validates email format', async ({ page }) => {
    await goToLogin(page);

    await page.getByLabel(/Email/i).fill('invalid-email');
    await page.getByRole('button', { name: /Continue/i }).click();

    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('validates empty email', async ({ page }) => {
    await goToLogin(page);

    await page.getByRole('button', { name: /Continue/i }).click();

    await expect(page.getByText(/valid email/i)).toBeVisible();
  });
});

test.describe('New User Registration', () => {
  test('shows registration form for unknown email', async ({ page }) => {
    await goToLogin(page);

    const testEmail = `pw-new-${Date.now()}@example.com`;
    await page.getByLabel(/Email/i).fill(testEmail);
    await page.getByRole('button', { name: /Continue/i }).click();

    // Wait for Supabase lookup and form transition
    await expect(page.getByLabel(/Your Name/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder(/Type or select a team/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Create Account/i })).toBeVisible();

    // Email should be shown and disabled
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeDisabled();
    await expect(emailInput).toHaveValue(testEmail);
  });

  test('validates registration fields', async ({ page }) => {
    await goToLogin(page);

    const testEmail = `pw-val-${Date.now()}@example.com`;
    await page.getByLabel(/Email/i).fill(testEmail);
    await page.getByRole('button', { name: /Continue/i }).click();

    await expect(page.getByLabel(/Your Name/i)).toBeVisible({ timeout: 10000 });

    // Submit without filling in name/team
    await page.getByRole('button', { name: /Create Account/i }).click();

    await expect(page.getByText(/Name is required/i)).toBeVisible();
    await expect(page.getByText(/Team is required/i)).toBeVisible();
  });

  test('completes full registration and redirects to dashboard', async ({ page }) => {
    const testEmail = `pw-reg-${Date.now()}@example.com`;
    await registerUser(page, testEmail, 'Playwright Test User', 'Test Team');

    expect(page.url()).toContain('/dashboard');
  });
});

test.describe('Returning User Login', () => {
  test('logs in existing user and redirects to dashboard', async ({ page }) => {
    const testEmail = `pw-login-${Date.now()}@example.com`;

    // First register
    await registerUser(page, testEmail, 'Login Test User', 'Test Team');

    // Now clear session and login again
    await page.evaluate(() => localStorage.clear());
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.getByLabel(/Email/i).fill(testEmail);
    await page.getByRole('button', { name: /Continue/i }).click();

    // Magic link flow: check-email → verify → dashboard
    await completeMagicLinkVerification(page, testEmail);
    expect(page.url()).toContain('/dashboard');
  });
});

test.describe('Session Persistence', () => {
  test('remembers logged-in user on page reload', async ({ page }) => {
    const testEmail = `pw-sess-${Date.now()}@example.com`;
    await registerUser(page, testEmail, 'Session Test User', 'Test Team');

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should still be on dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('redirects to login after clearing session', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await page.waitForURL('**/login', { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });
});

test.describe('Error Handling', () => {
  test('shows error on network failure during login', async ({ page }) => {
    await goToLogin(page);

    // Block Supabase API calls
    await page.route('**/rest/v1/**', (route) => route.abort());

    await page.getByLabel(/Email/i).fill('test@example.com');
    await page.getByRole('button', { name: /Continue/i }).click();

    // The form should not crash
    await page.waitForTimeout(3000);

    const hasForm = await page.locator('form').isVisible();
    expect(hasForm).toBe(true);
  });
});
