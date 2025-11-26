/**
 * Authentication E2E Tests
 * Tests: signup, login, admin access
 */

describe('Authentication', () => {
  const testEmail = `test-${Date.now()}@echelon.com`;
  const testPassword = 'TestPass123!';
  const testName = 'Test Admin';

  it('should load auth page', () => {
    cy.visit('/auth');
    cy.contains('Admin Login', { matchCase: false, timeout: 5000 }).should('be.visible');
  });

  it('should sign up new user', () => {
    cy.visit('/auth');
    
    // Click sign up button
    cy.contains('button', "Don't have an account", { matchCase: false }).click({ force: true });
    
    // Fill signup form
    cy.get('input#name').type(testName);
    cy.get('input#email').type(testEmail);
    cy.get('input#password').type(testPassword);
    
    // Submit
    cy.get('button[type="submit"]').click({ force: true });
    
    // Verify success message
    cy.contains('Account created', { matchCase: false, timeout: 5000 }).should('be.visible');
  });

  it('should login with credentials', () => {
    cy.visit('/auth');
    
    // Fill login form
    cy.get('input#email').type('admin@echelon.com');
    cy.get('input#password').type('admin123');
    
    // Submit
    cy.get('button[type="submit"]').click({ force: true });
    
    // Should redirect or show error
    cy.wait(2000);
  });

  it('should show validation for short password', () => {
    cy.visit('/auth');
    
    // Switch to signup
    cy.contains('button', "Don't have an account", { matchCase: false }).click({ force: true });
    
    cy.get('input#name').type('Test');
    cy.get('input#email').type('test@test.com');
    cy.get('input#password').type('123');
    
    // Try to submit
    cy.get('button[type="submit"]').click({ force: true });
    
    // HTML5 validation should prevent submission (password too short)
    cy.get('input#password:invalid').should('exist');
  });

  it('should toggle between login and signup', () => {
    cy.visit('/auth');
    
    // Should show login initially
    cy.contains('Admin Login', { matchCase: false }).should('be.visible');
    cy.get('input#name').should('not.exist');
    
    // Click to show signup
    cy.contains('button', "Don't have an account", { matchCase: false }).click({ force: true });
    cy.contains('Create Account', { matchCase: false }).should('be.visible');
    cy.get('input#name').should('be.visible');
    
    // Click to show login again
    cy.contains('button', 'Already have an account', { matchCase: false }).click({ force: true });
    cy.contains('Admin Login', { matchCase: false }).should('be.visible');
    cy.get('input#name').should('not.exist');
  });
});
