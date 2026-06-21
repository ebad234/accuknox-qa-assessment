const { test, expect } = require('@playwright/test');

test.setTimeout(90000);

test('OrangeHRM - Add User required fields validation', async ({ page }) => {
  // Open OrangeHRM login page
  await page.goto(
    'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
    { waitUntil: 'domcontentloaded', timeout: 90000 }
  );

  // Login
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  // Go to Admin
  await expect(page).toHaveURL(/dashboard/, { timeout: 30000 });
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page).toHaveURL(/viewSystemUsers/, { timeout: 30000 });

  // Open Add User page
  await page.getByRole('button', { name: /Add/ }).click();

  // Click Save without entering required details
  await page.getByRole('button', { name: 'Save' }).click();

  // Verify validation messages appear
  await expect(page.getByText('Required').first()).toBeVisible({
    timeout: 10000,
  });

  // Screenshot proof
  await page.screenshot({
    path: 'test-results/required-fields-validation.png',
    fullPage: true,
  });
});