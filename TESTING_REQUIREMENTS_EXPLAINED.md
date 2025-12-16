# Testing Requirements Explained - Software Construction and Testing Project

## Overview

This document explains what testing requirements you need to fulfill for your project based on the course requirements.

## What Testing Means for Your Project

Testing is about **proving your code works correctly** and **catching bugs before users do**. For this course, you need to demonstrate that you can write tests and that your code passes those tests.

---

## Required Testing Types

### 1. **Unit Testing** ✅ REQUIRED
**What it is:** Testing individual functions, methods, or components in isolation.

**For your project:**
- **Backend:** Test individual controller functions, helper functions, model validations
  - Example: Test `createProduct()` function with valid data, invalid data, missing fields
  - Example: Test `approveProduct()` function
  - Example: Test `createNotification()` helper function
  
- **Frontend:** Test individual React components, utility functions
  - Example: Test `NotificationBell` component renders correctly
  - Example: Test `ProductCard` component displays product info
  - Example: Test API functions handle errors correctly

**Coverage needed:** Both frontend and backend must have unit tests.

---

### 2. **Integration Testing** ✅ REQUIRED
**What it is:** Testing how different parts of your system work together.

**For your project:**
- Test API endpoints with database interactions
  - Example: Test POST `/product` creates a product in the database
  - Example: Test GET `/products` returns products from database
  - Example: Test PATCH `/product/:id/approve` updates product status
  
- Test frontend-backend communication
  - Example: Test that frontend can fetch products from backend
  - Example: Test that submitting a form sends data to backend correctly

**Coverage needed:** Test the integration between your frontend and backend.

---

### 3. **End-to-End (E2E) Testing** ✅ REQUIRED
**What it is:** Testing complete user workflows from start to finish, simulating real user behavior.

**For your project - Happy Path Scenarios:**

1. **User Registration → Login → Browse → Purchase Flow:**
   - User signs up
   - User signs in
   - User browses products
   - User adds product to cart
   - User goes to checkout
   - User completes order

2. **Admin Workflow:**
   - Admin signs in
   - Admin views pending products
   - Admin approves a product
   - Product appears in client view

3. **Brand Registration → Product Submission:**
   - User registers a brand
   - Admin approves brand
   - User submits product with that brand
   - Product appears in pending list

**Coverage needed:** At least one complete E2E scenario (registration to completion).

---

### 4. **Test-Driven Development (TDD)** ✅ REQUIRED
**What it is:** Writing tests BEFORE writing the code, then writing code to make tests pass.

**Evidence needed:**
- Show that you wrote tests first (commit history, documentation)
- Example: Write test for `approveProduct()` function, then implement the function
- Example: Write test for `NotificationBell` component, then build the component

**How to demonstrate:**
- Keep test files created before implementation files
- Document TDD process in your project
- Show test failures first, then implementation, then passing tests

---

## Test Coverage Requirements

### What is Test Coverage?
Test coverage measures how much of your code is tested by your tests.

**Requirements:**
- ✅ Unit tests for both frontend and backend
- ✅ Integration tests for API endpoints
- ✅ E2E tests for complete user flows
- ✅ Tests must cover both happy paths (successful scenarios) and error cases

### Coverage Goals:
- Aim for **at least 60-70% code coverage**
- Focus on critical paths (authentication, product management, orders)
- Test error handling (invalid input, missing data, network errors)

---

## Traceability to User Stories

### What This Means:
Every test case should be linked back to a user story.

**Example:**
- **User Story:** "As a client, I want to browse products so that I can see what's available"
- **Test Case:** "Test that GET /products returns a list of approved products"
- **Traceability:** This test verifies the user story requirement

**How to document:**
- Create a test matrix showing:
  - User Story ID
  - Test Case ID
  - Test Description
  - Test Type (Unit/Integration/E2E)

---

## Mandatory During Evaluation

### What You Must Demonstrate Live:

1. **Unit Testing:**
   - Run at least 1-2 core modules with unit tests
   - Show tests passing
   - Example: Run all product controller tests
   - Example: Run all notification helper tests

2. **End-to-End Testing:**
   - Run at least one complete E2E scenario
   - Show the complete flow from registration to completion
   - Example: Full user signup → login → browse → purchase flow

### Preparation:
- Make sure all tests can run with a single command
- Have test data ready (test users, test products)
- Practice running tests before evaluation
- Be ready to explain what each test does

---

## Testing Tools You Can Use

### Backend Testing:
- **Jest** or **Mocha** - JavaScript testing framework
- **Supertest** - For testing Express.js API endpoints
- **Mongoose** - For testing database operations

### Frontend Testing:
- **Vitest** or **Jest** - Testing framework (you already have Vitest)
- **React Testing Library** - For testing React components
- **Cypress** or **Playwright** - For E2E testing

### Coverage Tools:
- **Istanbul/NYC** - Code coverage tool
- **Vitest coverage** - Built-in coverage for Vitest

---

## What You Need to Create

1. **Test Files:**
   - `backend/__tests__/` or `backend/**/*.test.js` - Backend unit tests
   - `frontend/src/**/*.test.tsx` - Frontend unit tests
   - `e2e/` or `tests/e2e/` - End-to-end tests

2. **Test Configuration:**
   - `jest.config.js` or `vitest.config.ts` - Test configuration
   - Test setup files
   - Test data fixtures

3. **Documentation:**
   - Test plan document
   - Test coverage report
   - Test traceability matrix (linking tests to user stories)

---

## Next Steps

1. **Review your current codebase** - Identify what needs testing
2. **Choose testing tools** - Set up Jest/Vitest for unit tests, Cypress/Playwright for E2E
3. **Write test plan** - Document what you'll test
4. **Start with TDD** - Write tests first for new features
5. **Add tests to existing code** - Retrofit tests for current features
6. **Generate coverage reports** - Show how much code is tested
7. **Practice running tests** - Be ready for live demonstration

---

## Summary Checklist

- [ ] Unit tests for backend (controllers, helpers, models)
- [ ] Unit tests for frontend (components, pages, utilities)
- [ ] Integration tests (API endpoints with database)
- [ ] E2E tests (complete user workflows)
- [ ] TDD evidence (tests written before code)
- [ ] Test coverage reports (60-70% minimum)
- [ ] Tests traceable to user stories
- [ ] Can run tests with single command
- [ ] Ready to demonstrate live during evaluation

---

## Questions to Answer

Before you start testing, make sure you can answer:
1. What user stories do we have? (List them)
2. What are our core features? (These need the most testing)
3. What are the critical paths? (Signup, login, purchase, admin approval)
4. What can go wrong? (Error cases to test)
5. How do we run all tests? (Single command)
6. What's our test coverage? (Percentage)

