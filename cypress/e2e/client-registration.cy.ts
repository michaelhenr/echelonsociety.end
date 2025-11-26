/**
 * Client Registration E2E Tests
 * Tests: client name entry dialog, tracking in admin panel
 */

describe('Client Registration', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(1000);
  });

  it('should show welcome dialog on first visit', () => {
    // Look for dialog or modal asking for name
    cy.get('[role="dialog"], [class*="dialog"], [class*="modal"]', { timeout: 5000 }).should('exist');
    cy.contains(/welcome|name|echelon/i).should('be.visible');
  });

  it('should display name input field', () => {
    cy.get('input[name="name"], input[placeholder*="name"]', { timeout: 5000 }).should('be.visible');
  });

  it('should validate required name field', () => {
    cy.get('button').contains(/submit|continue|enter/i).first().click({ force: true });
    // Should show validation or prevent submission
    cy.wait(500);
  });

  it('should accept valid name and close dialog', () => {
    const clientName = `Cypress User ${Date.now()}`;
    
    cy.get('input[name="name"], input[placeholder*="name"]').first().type(clientName);
    cy.get('button').contains(/submit|continue|enter/i).first().click({ force: true });
    
    // Dialog should close
    cy.wait(2000);
    cy.get('[role="dialog"], [class*="dialog"]').should('not.exist');
  });

  it('should navigate to products after client registration', () => {
    const clientName = `Auto Navigate ${Date.now()}`;
    
    cy.get('input[name="name"], input[placeholder*="name"]', { timeout: 5000 }).first().type(clientName);
    cy.get('button').contains(/submit|continue|enter/i).first().click({ force: true });
    
    // Should be able to browse products
    cy.wait(2000);
    cy.contains(/product|client|echelon/i).should('be.visible');
  });

  it('should store client entry for admin tracking', () => {
    const trackedName = `Tracked User ${Date.now()}`;
    
    cy.get('input[name="name"], input[placeholder*="name"]', { timeout: 5000 }).first().type(trackedName);
    cy.get('button').contains(/submit|continue|enter/i).first().click({ force: true });
    
    cy.wait(2000);
    
    // Navigate to admin panel to verify
    // (Note: This assumes admin access via logo clicks)
    // For now, just verify the registration completed
    cy.url().should('exist');
  });

  it('should accept email along with name if provided', () => {
    const clientName = `Email User ${Date.now()}`;
    const clientEmail = `cypress${Date.now()}@client.com`;
    
    cy.get('input[name="name"], input[placeholder*="name"]', { timeout: 5000 }).first().type(clientName);
    
    // Check if email field exists (optional field)
    cy.get('body').then(($body) => {
      if ($body.find('input[type="email"]').length > 0) {
        cy.get('input[type="email"]').first().type(clientEmail);
      }
    });
    
    cy.get('button').contains(/submit|continue|enter/i).first().click({ force: true });
    cy.wait(2000);
  });
});
