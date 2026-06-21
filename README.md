# AccuKnox QA Assessment – Playwright Automation

## Overview

This project automates the OrangeHRM User Management workflow using Playwright and JavaScript.

## Automated Test Cases

1. Navigate to Admin Module
2. Add a New User
3. Search the Newly Created User
4. Edit User Details
5. Validate Updated Details
6. Delete the User

## Application Under Test

OrangeHRM Demo: https://opensource-demo.orangehrmlive.com/

## Tools Used

* Playwright
* JavaScript
* Node.js
* Chromium

## Installation

```bash
npm install
npx playwright install
```

## Run Tests

```bash
npx playwright test user-management.spec.js --project=chromium
```

## Run Tests in Headed Mode

```bash
npx playwright test user-management.spec.js --project=chromium --headed
```

## Open HTML Report

```bash
npx playwright show-report
```

## Test Design

The workflow is organized into six separate serial test blocks. A unique username is generated on every execution to prevent duplicate-user conflicts.

## Wait Strategy

The automation uses Playwright’s reliable waits:

* `locator.waitFor()`
* `expect().toBeVisible()`
* `expect().toHaveURL()`

## Validations

* The newly created user appears in search results.
* The updated username appears in search results.
* The user status is updated to Disabled.
* The deleted user row disappears from the results.
