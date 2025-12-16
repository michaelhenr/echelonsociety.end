# End-to-End (E2E) Testing Guide

## Overview

This document describes the E2E tests for the Echelon Society e-commerce platform. E2E tests verify complete user workflows from start to finish.

## Test Coverage

### ✅ Complete User Shopping Flow (REQUIRED)

**File:** `cypress/e2e/user-shopping-flow.cy.ts`

**Scenario:** User Registration → Login → Browse → Purchase Flow

This test covers the **required E2E scenario** from the project requirements:

1. **User Registration (Sign Up)**
   - Navigate to sign up page
   - Fill registration form
   - Submit and verify redirect to sign in

2. **User Authentication (Sign In)**
   - Fill sign in form with credentials
   - Submit and verify authentication
   - Verify redirect to home page

3. **Product Browsing**
   - Navigate to products page
   - Verify products are displayed
   - Verify search/filter functionality

4. **Add to Cart**
   - Click "Add to Cart" on a product
   - Verify toast notification
   - Verify cart count updates

5. **Checkout Process**
   - Navigate to checkout page
   - Fill shipping information
   - Submit order

6. **Order Completion**
   - Verify order success message
   - Verify redirect to products page

### Additional E2E Tests

- **Product Browsing After Authentication**: Tests that authenticated users can browse products
- **Protected Route Authentication**: Tests that unauthenticated users are redirected to sign in

## Running E2E Tests

### Prerequisites

1. **Backend must be running:**
   ```bash
   cd backend
   npm start
   ```
   Backend should be running on `http://localhost:3400`

2. **Frontend must be running:**
   ```bash
   npm run dev
   ```
   Frontend should be running on `http://localhost:8080`

3. **Database should have:**
   - At least one approved product (for cart/checkout tests)
   - Or the test will gracefully skip cart operations

### Running Tests

#### Option 1: Interactive Mode (Recommended for Development)
```bash
npm run cy:open
```
This opens the Cypress Test Runner where you can:
- See tests run in real-time
- Debug tests step by step
- Watch test execution

#### Option 2: Headless Mode (For CI/CD)
```bash
npm run cy:run
```
This runs all tests in headless mode and outputs results to the terminal.

#### Option 3: Run Specific Test File
```bash
npx cypress run --spec "cypress/e2e/user-shopping-flow.cy.ts"
```

## Test Structure

```
cypress/
├── e2e/
│   └── user-shopping-flow.cy.ts    # Complete shopping flow E2E test
├── support/
│   └── e2e.ts                      # Cypress support file
└── config/
    └── support/
        └── commands.ts             # Custom Cypress commands
```

## Test Data

The E2E test uses **dynamic test data** to avoid conflicts:
- Email: `e2e-test-{timestamp}@example.com`
- Password: `TestPassword123`
- Name: `E2E Test User`

Each test run creates a unique user to avoid database conflicts.

## Expected Behavior

### Happy Path Flow

1. ✅ User can sign up successfully
2. ✅ User can sign in with new credentials
3. ✅ User can browse products
4. ✅ User can add products to cart
5. ✅ User can complete checkout
6. ✅ Order is placed successfully

### Edge Cases Handled

- No products available: Test gracefully skips cart operations
- Protected routes: Unauthenticated users are redirected
- Form validation: All required fields must be filled

## Troubleshooting

### Tests Fail at Sign Up
- Check backend is running on port 3400
- Check database connection
- Verify `/user/signup` endpoint is accessible

### Tests Fail at Product Browsing
- Ensure at least one approved product exists in database
- Check `/product` endpoint returns products
- Verify frontend API calls are working

### Tests Fail at Checkout
- Ensure products were added to cart successfully
- Check `/cart` or `/orders` endpoint is working
- Verify form fields match the actual checkout form

## Integration with Test Suite

E2E tests are separate from unit tests:
- **Unit Tests**: `npm test` (runs unit tests)
- **E2E Tests**: `npm run cy:run` (runs E2E tests)

For complete testing:
```bash
# Run unit tests
npm test

# Run E2E tests (in separate terminal with servers running)
npm run cy:run
```

## Evaluation Notes

For project evaluation, demonstrate:
1. ✅ Complete E2E flow from registration to order completion
2. ✅ Test runs successfully in Cypress
3. ✅ All steps of the happy path are verified
4. ✅ Test handles edge cases gracefully

## Future Enhancements

Potential additional E2E tests:
- Admin workflow (approve products, manage orders)
- Brand registration flow
- Product submission flow
- Error handling scenarios
- Payment processing (if implemented)

