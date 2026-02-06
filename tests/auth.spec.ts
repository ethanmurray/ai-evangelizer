import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display welcome screen for non-authenticated users', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check for welcome screen elements
    await expect(page.locator('h1')).toContainText('AI Evangelizer Leaderboard');
    await expect(page.getByRole('button', { name: /Get Started/i })).toBeVisible();
  });

  test('should show auth form when clicking Get Started', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click the Get Started button
    await page.getByRole('button', { name: /Get Started/i }).click();

    // Should now see the auth form
    await expect(page.getByText('Welcome to AI Evangelizer')).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue/i })).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click Get Started
    await page.getByRole('button', { name: /Get Started/i }).click();

    // Enter invalid email
    await page.getByLabel(/Email/i).fill('invalid-email');
    await page.getByRole('button', { name: /Continue/i }).click();

    // Should show validation error
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('should show registration form for new user', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click Get Started
    await page.getByRole('button', { name: /Get Started/i }).click();

    // Enter a new email (one that doesn't exist)
    const testEmail = `test-${Date.now()}@example.com`;
    await page.getByLabel(/Email/i).fill(testEmail);
    await page.getByRole('button', { name: /Continue/i }).click();

    // Wait for the form to update - should show registration fields
    await page.waitForTimeout(2000);

    // Take a screenshot to see what's happening
    await page.screenshot({ path: 'tests/screenshots/after-email-continue.png' });

    // Log the page content for debugging
    const pageContent = await page.content();
    console.log('Page content after Continue:', pageContent.substring(0, 2000));
  });

  test('should complete full registration flow', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    await page.screenshot({ path: 'tests/screenshots/01-initial.png' });

    // Click Get Started
    await page.getByRole('button', { name: /Get Started/i }).click();
    await page.screenshot({ path: 'tests/screenshots/02-auth-form.png' });

    // Enter email
    const testEmail = `playwright-test-${Date.now()}@example.com`;
    await page.getByLabel(/Email/i).fill(testEmail);
    await page.screenshot({ path: 'tests/screenshots/03-email-entered.png' });

    // Click Continue
    await page.getByRole('button', { name: /Continue/i }).click();

    // Wait for response from server
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'tests/screenshots/04-after-continue.png' });

    // Check what elements are visible now
    const firstNameVisible = await page.getByLabel(/First Name/i).isVisible().catch(() => false);
    const lastNameVisible = await page.getByLabel(/Last Name/i).isVisible().catch(() => false);
    const createAccountVisible = await page.getByRole('button', { name: /Create Account/i }).isVisible().catch(() => false);

    console.log('First Name visible:', firstNameVisible);
    console.log('Last Name visible:', lastNameVisible);
    console.log('Create Account visible:', createAccountVisible);

    // If registration form is shown, fill it out
    if (firstNameVisible && lastNameVisible) {
      await page.getByLabel(/First Name/i).fill('Test');
      await page.getByLabel(/Last Name/i).fill('User');

      // Check terms checkbox if visible
      const termsCheckbox = page.getByRole('checkbox');
      if (await termsCheckbox.isVisible()) {
        await termsCheckbox.check();
      }

      await page.screenshot({ path: 'tests/screenshots/05-form-filled.png' });

      // Click Create Account
      await page.getByRole('button', { name: /Create Account/i }).click();

      // Wait for registration to complete
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'tests/screenshots/06-after-register.png' });
    }

    // Check final state
    const dashboardVisible = await page.getByText(/Welcome to your dashboard/i).isVisible().catch(() => false);
    const successVisible = await page.getByText(/Success/i).isVisible().catch(() => false);
    const errorVisible = await page.getByRole('alert').isVisible().catch(() => false);

    console.log('Dashboard visible:', dashboardVisible);
    console.log('Success visible:', successVisible);
    console.log('Error alert visible:', errorVisible);

    if (errorVisible) {
      const errorText = await page.getByRole('alert').textContent();
      console.log('Error message:', errorText);
    }
  });
});
