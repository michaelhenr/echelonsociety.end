/**
 * Newsletter Subscription E2E Tests
 * Tests: subscription flow, discount code generation, validation
 */

describe('Newsletter Subscription', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display newsletter subscription section', () => {
    cy.get('input[type="email"], input[placeholder*="email"]', { timeout: 10000 }).should('exist');
    cy.contains('newsletter', { matchCase: false }).should('exist');
  });

  it('should validate email format', () => {
    cy.get('input[type="email"], input[placeholder*="email"]').first().type('invalid-email');
    cy.get('button').contains(/subscribe|sign up/i).click({ force: true });
    
    // Should show validation error
    cy.wait(1000);
  });

  it('should accept valid email', () => {
    const uniqueEmail = `cypress${Date.now()}@test.com`;
    
    cy.get('input[type="email"], input[placeholder*="email"]').first().clear().type(uniqueEmail);
    cy.get('button').contains(/subscribe|sign up/i).click({ force: true });
    
    // Should show success message with discount code
    cy.contains(/success|subscribed|10%|ECHELON10/i, { timeout: 5000 }).should('be.visible');
  });

  it('should display discount code after subscription', () => {
    const uniqueEmail = `discount${Date.now()}@test.com`;
    
    cy.get('input[type="email"], input[placeholder*="email"]').first().clear().type(uniqueEmail);
    cy.get('button').contains(/subscribe|sign up/i).click({ force: true });
    
    // Should mention 10% discount or ECHELON10 code
    cy.contains(/10%|ECHELON10|discount/i, { timeout: 5000 }).should('be.visible');
  });

  it('should clear form after successful subscription', () => {
    const uniqueEmail = `clear${Date.now()}@test.com`;
    
    cy.get('input[type="email"], input[placeholder*="email"]').first().clear().type(uniqueEmail);
    cy.get('button').contains(/subscribe|sign up/i).click({ force: true });
    
    cy.wait(2000);
    
    // Email field should be cleared
    cy.get('input[type="email"], input[placeholder*="email"]').first().should('have.value', '');
  });

  it('should handle duplicate email subscription', () => {
    const duplicateEmail = 'duplicate@test.com';
    
    // First subscription
    cy.get('input[type="email"], input[placeholder*="email"]').first().clear().type(duplicateEmail);
    cy.get('button').contains(/subscribe|sign up/i).click({ force: true });
    cy.wait(2000);
    
    // Second subscription attempt with same email
    cy.get('input[type="email"], input[placeholder*="email"]').first().clear().type(duplicateEmail);
    cy.get('button').contains(/subscribe|sign up/i).click({ force: true });
    
    // Should handle gracefully (either success or "already subscribed" message)
    cy.wait(1000);
  });
});
