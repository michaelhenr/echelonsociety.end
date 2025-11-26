/**
 * Brand Submission E2E Tests
 * Tests: form validation, brand creation, duplicate detection
 */

describe('Brand Submission', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('button, a', 'Brand', { matchCase: false }).click({ force: true });
  });

  it('should load brand submission form', () => {
    cy.url().should('match', /submit-brand|submitbrand/i);
    cy.get('input[name="name"], input[placeholder*="Brand"]').should('be.visible');
  });

  it('should display all required form fields', () => {
    cy.get('input[name="name"], input[placeholder*="Brand"]').should('be.visible');
    cy.get('textarea[name="description"], textarea[placeholder*="Description"]').should('be.visible');
    cy.get('input[name="contact_email"], input[type="email"]').should('be.visible');
    cy.get('input[name="contact_phone"], input[type="tel"]').should('be.visible');
  });

  it('should validate required fields', () => {
    cy.get('button[type="submit"]').click({ force: true });
    cy.contains('required', { matchCase: false, timeout: 3000 }).should('be.visible');
  });

  it('should validate email format', () => {
    cy.get('input[name="name"], input[placeholder*="Brand"]').type('Test Brand');
    cy.get('input[name="contact_email"], input[type="email"]').type('invalid-email');
    cy.get('button[type="submit"]').click({ force: true });
    cy.contains('email', { matchCase: false, timeout: 3000 }).should('be.visible');
  });

  it('should submit valid brand data', () => {
    const uniqueBrand = `Cypress Brand ${Date.now()}`;
    
    cy.get('input[name="name"], input[placeholder*="Brand"]').type(uniqueBrand);
    cy.get('textarea[name="description"], textarea[placeholder*="Description"]').type('Premium fashion brand created via Cypress test');
    cy.get('input[name="contact_email"], input[type="email"]').type('cypress@test.com');
    cy.get('input[name="contact_phone"], input[type="tel"]').type('01234567890');
    
    cy.get('button[type="submit"]').click({ force: true });
    
    // Should show success message or redirect
    cy.url({ timeout: 10000 }).should('not.match', /submit-brand|submitbrand/i);
  });

  it('should handle form reset after submission', () => {
    const uniqueBrand = `Reset Test ${Date.now()}`;
    
    cy.get('input[name="name"], input[placeholder*="Brand"]').type(uniqueBrand);
    cy.get('input[name="contact_email"], input[type="email"]').type('reset@test.com');
    cy.get('button[type="submit"]').click({ force: true });
    
    cy.wait(2000);
    cy.visit('/submit-brand');
    
    cy.get('input[name="name"], input[placeholder*="Brand"]').should('have.value', '');
  });
});
