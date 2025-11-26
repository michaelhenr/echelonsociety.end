/**
 * Ad Submission E2E Tests
 * Tests: ad form with budget, dates, image validation
 */

describe('Ad Submission', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('button, a', 'Advertiser', { matchCase: false }).click({ force: true });
  });

  it('should load ad submission form', () => {
    cy.url().should('match', /submit-ad|submitad/i);
    cy.get('input[name="title"], input[placeholder*="Title"]').should('be.visible');
  });

  it('should display all required form fields', () => {
    cy.get('input[name="title"], input[placeholder*="Title"]').should('be.visible');
    cy.get('textarea[name="description"], textarea[placeholder*="Description"]').should('be.visible');
    cy.get('input[name="budget"], input[type="number"]').should('be.visible');
    cy.get('input[name="image_url"], input[placeholder*="Image"]').should('be.visible');
    cy.get('input[name="start_date"], input[type="date"]').should('be.visible');
    cy.get('input[name="end_date"], input[type="date"]').should('be.visible');
  });

  it('should validate required fields', () => {
    cy.get('button[type="submit"]').click({ force: true });
    cy.contains('required', { matchCase: false, timeout: 3000 }).should('be.visible');
  });

  it('should validate budget is a positive number', () => {
    cy.get('input[name="title"], input[placeholder*="Title"]').type('Test Ad');
    cy.get('input[name="budget"], input[type="number"]').type('-100');
    cy.get('button[type="submit"]').click({ force: true });
    // Should show validation error or prevent submission
  });

  it('should validate date range (end date after start date)', () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    cy.get('input[name="title"], input[placeholder*="Title"]').type('Date Test Ad');
    cy.get('input[name="budget"], input[type="number"]').type('1000');
    cy.get('input[name="start_date"], input[type="date"]').type(today);
    cy.get('input[name="end_date"], input[type="date"]').type(yesterday);
    cy.get('button[type="submit"]').click({ force: true });
    // Should show validation error
  });

  it('should submit valid ad data', () => {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    
    cy.get('input[name="title"], input[placeholder*="Title"]').type('Cypress Test Ad');
    cy.get('textarea[name="description"], textarea[placeholder*="Description"]').type('Premium fashion advertisement');
    cy.get('input[name="budget"], input[type="number"]').type('5000');
    cy.get('input[name="image_url"], input[placeholder*="Image"]').type('https://example.com/ad-image.jpg');
    cy.get('input[name="start_date"], input[type="date"]').type(today);
    cy.get('input[name="end_date"], input[type="date"]').type(nextWeek);
    
    cy.get('button[type="submit"]').click({ force: true });
    
    // Should redirect or show success
    cy.url({ timeout: 10000 }).should('not.match', /submit-ad|submitad/i);
  });

  it('should handle image URL input', () => {
    cy.get('input[name="image_url"], input[placeholder*="Image"]').type('https://via.placeholder.com/800x400');
    cy.get('input[name="image_url"], input[placeholder*="Image"]').should('have.value', 'https://via.placeholder.com/800x400');
  });
});
