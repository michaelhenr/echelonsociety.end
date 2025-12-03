describe('Checkout E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/checkout')
  })

  it('should display checkout page', () => {
    cy.get('[data-testid="checkout-container"]').should('be.visible')
  })

  it('should display order summary', () => {
    cy.get('[data-testid="order-summary"]').should('exist')
  })

  it('should allow user to fill shipping details', () => {
    cy.get('[data-testid="shipping-address"]').should('exist')
  })

  it('should allow user to select payment method', () => {
    cy.get('[data-testid="payment-method"]').should('exist')
  })

  it('should submit checkout form', () => {
    cy.get('[data-testid="submit-checkout"]').should('be.visible')
  })
})
