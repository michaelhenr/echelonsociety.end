// ***********************************************************
// This support file is processed before test files.
// Use this to add custom commands and utilities.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively, can be defined here:
// Cypress.Commands.add('login', (email, password) => { ... })

/**
 * Custom command to handle client registration dialog
 */
Cypress.Commands.add('registerClient', (name: string, email?: string) => {
  cy.get('input[name="name"], input[placeholder*="name"]', { timeout: 5000 })
    .first()
    .type(name);
  
  if (email) {
    cy.get('input[type="email"]').first().type(email);
  }
  
  cy.get('button').contains(/submit|continue|enter/i).first().click({ force: true });
  cy.wait(1000);
});

/**
 * Custom command to navigate to admin panel
 */
Cypress.Commands.add('accessAdmin', () => {
  cy.visit('/');
  
  // Click logo 5 times to trigger admin access
  for (let i = 0; i < 5; i++) {
    cy.get('img[alt*="logo"], [class*="logo"]').first().click({ force: true });
    cy.wait(200);
  }
  
  // Enter admin password
  cy.get('input[type="password"]', { timeout: 5000 }).type('333');
  cy.get('button[type="submit"]').click({ force: true });
  cy.wait(1000);
});

/**
 * Custom command to add product to cart
 */
Cypress.Commands.add('addToCart', () => {
  cy.visit('/products');
  cy.get('[class*="card"]').first().find('button').contains('Add', { matchCase: false }).click({ force: true });
  cy.wait(500);
});

/**
 * Custom command to subscribe to newsletter
 */
Cypress.Commands.add('subscribeNewsletter', (email: string) => {
  cy.get('input[type="email"], input[placeholder*="email"]').first().clear().type(email);
  cy.get('button').contains(/subscribe|sign up/i).click({ force: true });
  cy.wait(1000);
});

// Prevent TypeScript errors for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      registerClient(name: string, email?: string): Chainable<void>;
      accessAdmin(): Chainable<void>;
      addToCart(): Chainable<void>;
      subscribeNewsletter(email: string): Chainable<void>;
    }
  }
}

// Disable Cypress video recording for faster tests
Cypress.config('video', false);

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false prevents Cypress from failing the test
  // Only for known non-critical errors
  if (err.message.includes('ResizeObserver') || err.message.includes('hydration')) {
    return false;
  }
  return true;
});

export {};
