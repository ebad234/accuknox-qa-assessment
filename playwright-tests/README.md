# AccuKnox QA Assessment - Playwright Automation

## Project Description

This project automates the OrangeHRM Admin User Management workflow using Playwright with JavaScript.

## Automated Test Scenarios

1. Navigate to the Admin Module
2. Add a New User
3. Search the Newly Created User
4. Edit User Details
5. Validate Updated Details
6. Delete the User

## Application Under Test

OrangeHRM Demo Application:

https://opensource-demo.orangehrmlive.com/

## Technology Stack

* JavaScript
* Node.js
* Playwright
* Chromium

## Playwright Version Used

```text
@playwright/test:1.61.0
```

> Check your `package.json`. If it shows another version, copy that exact version here.

---

# Project Setup Steps

## Prerequisites

Install the following before running the project:

1. Node.js version 18 or higher
2. Git
3. Google Chrome or Chromium browser

## Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Example:

```bash
git clone https://github.com/your-github-username/accuknox-qa-assessment.git
```

## Step 2: Open the Project Folder

```bash
cd accuknox-qa-assessment
```

## Step 3: Install Project Dependencies

```bash
npm install
```

## Step 4: Install Playwright Browsers

```bash
npx playwright install
```

---

# How to Run the Test Cases

## Run all test cases in Chromium

```bash
npx playwright test user-management.spec.js --project=chromium
```

## Run test cases with the browser visible

```bash
npx playwright test user-management.spec.js --project=chromium --headed
```

## Run tests using Playwright UI mode

```bash
npx playwright test --ui
```

## Open the HTML Test Report

```bash
npx playwright show-report
```

---

# Test File Location

```text
tests/user-management.spec.js
```

## Test Design

The required workflow is organized into six separate serial test blocks.

A unique username is generated during every test run using `Date.now()` to avoid duplicate username errors.

## Wait Strategy

The automation uses proper Playwright waits and assertions:

* `locator.waitFor()`
* `expect().toBeVisible()`
* `expect().toHaveURL()`

## Validations Performed

* The created user appears in the search results.
* The edited username appears in the search results.
* The user status is updated and validated as Disabled.
* The user is deleted and no longer appears in the results.
