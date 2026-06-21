const { test, expect } = require('@playwright/test');

test.setTimeout(120000);

test('OrangeHRM - Add User, Search User and Verify Result', async ({ page }) => {
  const username = `ranga_${Date.now()}`;
  const password = 'Test@12345';

  // Open login page
  await page.goto(
    'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
    { waitUntil: 'domcontentloaded', timeout: 90000 }
  );

  // Login
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  // Wait for dashboard
  await expect(page).toHaveURL(/dashboard/, { timeout: 30000 });

  // Open Admin page
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page).toHaveURL(/viewSystemUsers/, { timeout: 30000 });

  // Click Add button
  await page.getByRole('button', { name: /Add/ }).click();

  // Select User Role = ESS
  await page.locator('.oxd-select-text').nth(0).click();
  await page.getByRole('option', { name: 'ESS' }).click();

  // Select Employee Name = Ranga Akunuri
  const employeeNameInput = page.getByRole('textbox', {
    name: 'Type for hints...',
  });

  await employeeNameInput.fill('Ranga');

  await page.getByText('Ranga Akunuri', { exact: true }).click();

  // Select Status = Enabled
  await page.locator('.oxd-select-text').nth(1).click();
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Fill Username, Password and Confirm Password
  const inputs = page.locator('input:visible');
  const totalInputs = await inputs.count();

  await inputs.nth(totalInputs - 3).fill(username);
  await inputs.nth(totalInputs - 2).fill(password);
  await inputs.nth(totalInputs - 1).fill(password);

  // Save user
  await page.getByRole('button', { name: 'Save' }).click();

  // Wait until User Management page returns
  await expect(page).toHaveURL(/viewSystemUsers/, { timeout: 30000 });

  // Pause so you can SEE the page after adding user
  await page.waitForTimeout(3000);

  // Find Username search box safely
  const usernameSearchBox = page.locator(
    'div.oxd-input-group:has(label:text-is("Username")) input'
  );

  await usernameSearchBox.fill(username);

  // Pause so you can SEE username typed in search box
  await page.waitForTimeout(2000);

  // Click Search
  await page.getByRole('button', { name: 'Search' }).click();

  // Wait for table results to load
  await page.waitForTimeout(3000);

  // Find the row which contains the created username
  const userRow = page.locator('.oxd-table-card').filter({
    hasText: username,
  });

  // Verify exact created user row is visible
  await expect(userRow).toBeVisible({ timeout: 30000 });

  // Screenshot proof
  await page.screenshot({
    path: `test-results/${username}-search-result.png`,
    fullPage: true,
  });
});