/**
 * Payment E2E Tests
 * Tests: cash on delivery and visa payment flows
 */

describe('Payment Methods', () => {
  beforeEach(() => {
    cy.visit('/');
    // Navigate to products and add item to cart
    cy.get('a, button').contains('Products', { matchCase: false }).click({ force: true });
    cy.get('[class*="card"]').first().find('button').contains('Add', { matchCase: false }).click({ force: true });
    cy.wait(500);
    cy.get('button').contains('View Cart', { matchCase: false }).click({ force: true });
  });

  it('should complete checkout with cash on delivery', () => {
    // Fill checkout form
    cy.get('input#name').type('Test User');
    cy.get('input#email').type('test@example.com');
    cy.get('input#phone').type('01234567890');
    cy.get('input#address').type('123 Test Street');
    
    // Select city
    cy.get('[role="combobox"]').first().click({ force: true });
    cy.get('[role="option"]').contains('Cairo', { matchCase: false }).click({ force: true });
    
    // Verify cash on delivery is selected by default
    cy.get('input#cash').should('be.checked');
    
    // Submit order
    cy.get('button[type="submit"]').click({ force: true });
    
    // Verify success
    cy.contains('Order Placed Successfully', { matchCase: false, timeout: 5000 }).should('be.visible');
  });

  it('should show card fields when visa is selected', () => {
    // Fill basic info
    cy.get('input#name').type('Test User');
    cy.get('input#email').type('test@example.com');
    cy.get('input#phone').type('01234567890');
    cy.get('input#address').type('123 Test Street');
    
    // Select city
    cy.get('[role="combobox"]').first().click({ force: true });
    cy.get('[role="option"]').contains('Cairo', { matchCase: false }).click({ force: true });
    
    // Card fields should not be visible initially
    cy.get('input#cardNumber').should('not.exist');
    
    // Select Visa payment
    cy.get('input#visa').click({ force: true });
    
    // Card fields should now be visible
    cy.get('input#cardNumber').should('be.visible');
    cy.get('input#cardExpiry').should('be.visible');
    cy.get('input#cardCVV').should('be.visible');
  });

  it('should validate card number length', () => {
    // Fill basic info
    cy.get('input#name').type('Test User');
    cy.get('input#email').type('test@example.com');
    cy.get('input#phone').type('01234567890');
    cy.get('input#address').type('123 Test Street');
    
    // Select city
    cy.get('[role="combobox"]').first().click({ force: true });
    cy.get('[role="option"]').contains('Cairo', { matchCase: false }).click({ force: true });
    
    // Select Visa
    cy.get('input#visa').click({ force: true });
    
    // Enter short card number
    cy.get('input#cardNumber').type('123456');
    cy.get('input#cardExpiry').type('1225');
    cy.get('input#cardCVV').type('123');
    
    // Try to submit
    cy.get('button[type="submit"]').click({ force: true });
    
    // Should show validation error
    cy.contains('Card number must be 16 digits', { matchCase: false, timeout: 3000 }).should('be.visible');
  });

  it('should complete checkout with valid visa card', () => {
    // Fill basic info
    cy.get('input#name').type('Test User');
    cy.get('input#email').type('test@example.com');
    cy.get('input#phone').type('01234567890');
    cy.get('input#address').type('123 Test Street');
    
    // Select city
    cy.get('[role="combobox"]').first().click({ force: true });
    cy.get('[role="option"]').contains('Cairo', { matchCase: false }).click({ force: true });
    
    // Select Visa
    cy.get('input#visa').click({ force: true });
    
    // Fill card details
    cy.get('input#cardNumber').type('1234567890123456');
    cy.get('input#cardExpiry').type('1225');
    cy.get('input#cardCVV').type('123');
    
    // Submit order
    cy.get('button[type="submit"]').click({ force: true });
    
    // Verify success
    cy.contains('Order Placed Successfully', { matchCase: false, timeout: 5000 }).should('be.visible');
  });

  it('should format card expiry with slash', () => {
    // Navigate to checkout and select visa
    cy.get('input#name').type('Test');
    cy.get('input#email').type('test@test.com');
    cy.get('input#phone').type('01234567890');
    cy.get('input#address').type('Test');
    
    cy.get('[role="combobox"]').first().click({ force: true });
    cy.get('[role="option"]').contains('Cairo', { matchCase: false }).click({ force: true });
    
    cy.get('input#visa').click({ force: true });
    
    // Type expiry and verify formatting
    cy.get('input#cardExpiry').type('1225');
    cy.get('input#cardExpiry').should('have.value', '12/25');
  });

  it('should limit card number to 16 digits', () => {
    cy.get('input#name').type('Test');
    cy.get('input#email').type('test@test.com');
    cy.get('input#phone').type('01234567890');
    cy.get('input#address').type('Test');
    
    cy.get('[role="combobox"]').first().click({ force: true });
    cy.get('[role="option"]').contains('Cairo', { matchCase: false }).click({ force: true });
    
    cy.get('input#visa').click({ force: true });
    
    // Try to enter more than 16 digits
    cy.get('input#cardNumber').type('12345678901234567890');
    cy.get('input#cardNumber').should('have.value', '1234567890123456');
  });

  it('should limit CVV to 3 digits', () => {
    cy.get('input#name').type('Test');
    cy.get('input#email').type('test@test.com');
    cy.get('input#phone').type('01234567890');
    cy.get('input#address').type('Test');
    
    cy.get('[role="combobox"]').first().click({ force: true });
    cy.get('[role="option"]').contains('Cairo', { matchCase: false }).click({ force: true });
    
    cy.get('input#visa').click({ force: true });
    
    // Try to enter more than 3 digits
    cy.get('input#cardCVV').type('12345');
    cy.get('input#cardCVV').should('have.value', '123');
  });
});
