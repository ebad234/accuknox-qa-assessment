const { test, expect } = require('@playwright/test');

// OrangeHRM demo site can sometimes be slow
test.setTimeout(180000);

// Run all 6 test blocks in order
test.describe.configure({ mode: 'serial' });

// Unique usernames for every test run
const username = `ranga_qa_${Date.now()}`;
const updatedUsername = `ranga_updated_${Date.now()}`;
const password = 'Test@12345';

let sharedPage;
let sharedContext;

// ==================================================
// LOGIN ONCE BEFORE ALL TESTS
// ==================================================
test.beforeAll(async ({ browser }) => {
  sharedContext = await browser.newContext();
  sharedPage = await sharedContext.newPage();

  await sharedPage.goto(
    'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
    {
      waitUntil: 'commit',
      timeout: 120000,
    }
  );

  const usernameInput = sharedPage.getByPlaceholder('Username');

  await usernameInput.waitFor({
    state: 'visible',
    timeout: 120000,
  });

  await usernameInput.fill('Admin');

  const passwordInput = sharedPage.getByPlaceholder('Password');

  await passwordInput.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await passwordInput.fill('admin123');

  const loginButton = sharedPage.getByRole('button', {
    name: 'Login',
  });

  await loginButton.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await loginButton.click();

  await expect(sharedPage).toHaveURL(/dashboard/, {
    timeout: 60000,
  });
}, 180000);

// ==================================================
// CLOSE BROWSER AFTER ALL TESTS
// ==================================================
test.afterAll(async () => {
  if (sharedContext) {
    await sharedContext.close();
  }
});

// ==================================================
// OPEN ADMIN MODULE
// ==================================================
async function openAdminModule() {
  if (sharedPage.url().includes('viewSystemUsers')) {
    return;
  }

  const adminLink = sharedPage.getByRole('link', {
    name: 'Admin',
  });

  await adminLink.waitFor({
    state: 'visible',
    timeout: 60000,
  });

  await adminLink.click();

  await expect(sharedPage).toHaveURL(/viewSystemUsers/, {
    timeout: 60000,
  });

  await expect(
    sharedPage.getByRole('heading', { name: 'System Users' })
  ).toBeVisible({
    timeout: 60000,
  });
}

// ==================================================
// SEARCH USER BY USERNAME
// ==================================================
async function searchUser(searchUsername) {
  await openAdminModule();

  const usernameSearchBox = sharedPage.locator(
    'div.oxd-input-group:has(label:text-is("Username")) input'
  );

  await usernameSearchBox.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await usernameSearchBox.fill(searchUsername);

  const searchButton = sharedPage.getByRole('button', {
    name: 'Search',
  });

  await searchButton.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await searchButton.click();

  const userRow = sharedPage.locator('.oxd-table-card').filter({
    hasText: searchUsername,
  });

  await expect(userRow).toBeVisible({
    timeout: 30000,
  });

  return userRow;
}

// ==================================================
// TEST BLOCK 1: NAVIGATE TO ADMIN MODULE
// ==================================================
test('1. Navigate to Admin Module', async () => {
  await openAdminModule();

  await expect(
    sharedPage.getByRole('heading', { name: 'System Users' })
  ).toBeVisible({
    timeout: 30000,
  });
});

// ==================================================
// TEST BLOCK 2: ADD A NEW USER
// ==================================================
test('2. Add a New User', async () => {
  await openAdminModule();

  const addButton = sharedPage.getByRole('button', {
    name: /Add/,
  });

  await addButton.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await addButton.click();

  await expect(
    sharedPage.getByRole('heading', { name: 'Add User' })
  ).toBeVisible({
    timeout: 30000,
  });

  // User Role = ESS
  const selects = sharedPage.locator('.oxd-select-text');

  await selects.nth(0).click();

  const essOption = sharedPage.getByRole('option', {
    name: 'ESS',
  });

  await essOption.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await essOption.click();

  // Employee Name = Ranga Akunuri
  const employeeInput = sharedPage.getByRole('textbox', {
    name: 'Type for hints...',
  });

  await employeeInput.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await employeeInput.fill('Ranga');

  const employeeOption = sharedPage.getByText('Ranga Akunuri', {
    exact: true,
  });

  await employeeOption.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await employeeOption.click();

  // Status = Enabled
  await selects.nth(1).click();

  const enabledOption = sharedPage.getByRole('option', {
    name: 'Enabled',
  });

  await enabledOption.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await enabledOption.click();

  // Fill Username, Password, Confirm Password
  const visibleInputs = sharedPage.locator('input:visible');
  const inputCount = await visibleInputs.count();

  await visibleInputs.nth(inputCount - 3).fill(username);
  await visibleInputs.nth(inputCount - 2).fill(password);
  await visibleInputs.nth(inputCount - 1).fill(password);

  const saveButton = sharedPage.getByRole('button', {
    name: 'Save',
  });

  await saveButton.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await saveButton.click();

  await expect(sharedPage).toHaveURL(/viewSystemUsers/, {
    timeout: 60000,
  });
});

// ==================================================
// TEST BLOCK 3: SEARCH THE NEWLY CREATED USER
// ==================================================
test('3. Search the Newly Created User', async () => {
  const createdUserRow = await searchUser(username);

  await expect(createdUserRow.getByText(username)).toBeVisible({
    timeout: 30000,
  });
});

// ==================================================
// TEST BLOCK 4: EDIT USER DETAILS
// ==================================================
test('4. Edit User Details', async () => {
  const userRow = await searchUser(username);

  // Click pencil/edit icon inside the searched user row
  const editButton = userRow.locator('button').filter({
    has: sharedPage.locator('.bi-pencil-fill'),
  });

  await editButton.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await editButton.click();

  await expect(
    sharedPage.getByRole('heading', { name: 'Edit User' })
  ).toBeVisible({
    timeout: 30000,
  });

  // Change Status from Enabled to Disabled
  const selects = sharedPage.locator('.oxd-select-text');

  await selects.nth(1).click();

  const disabledOption = sharedPage.getByRole('option', {
    name: 'Disabled',
  });

  await disabledOption.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await disabledOption.click();

  // Change Username only
  const usernameField = sharedPage.locator(
    'div.oxd-input-group:has(label:text-is("Username")) input'
  );

  await usernameField.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await usernameField.fill(updatedUsername);

  const saveButton = sharedPage.getByRole('button', {
    name: 'Save',
  });

  await saveButton.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await saveButton.click();

  await expect(sharedPage).toHaveURL(/viewSystemUsers/, {
    timeout: 60000,
  });
});

// ==================================================
// TEST BLOCK 5: VALIDATE UPDATED DETAILS
// ==================================================
test('5. Validate Updated Details', async () => {
  const updatedUserRow = await searchUser(updatedUsername);

  // Validate updated username
  await expect(updatedUserRow.getByText(updatedUsername)).toBeVisible({
    timeout: 30000,
  });

  // Validate updated status
  await expect(updatedUserRow.getByText('Disabled')).toBeVisible({
    timeout: 30000,
  });
});

// ==================================================
// TEST BLOCK 6: DELETE THE USER
// ==================================================
test('6. Delete the User', async () => {
  const updatedUserRow = await searchUser(updatedUsername);

  // Click trash/delete icon inside the searched user row
  const deleteButton = updatedUserRow.locator('button').filter({
    has: sharedPage.locator('.bi-trash'),
  });

  await deleteButton.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await deleteButton.click();

  // Confirm deletion
  const yesDeleteButton = sharedPage.getByRole('button', {
    name: 'Yes, Delete',
  });

  await yesDeleteButton.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await yesDeleteButton.click();

  // Validate deleted user row disappears
  await expect(updatedUserRow).not.toBeVisible({
    timeout: 30000,
  });
});