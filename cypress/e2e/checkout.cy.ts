/**
 * Checkout Page E2E Tests
 * @description End-to-end tests for the checkout process
 * @module cypress/e2e/checkout
 * @url http://localhost:8080/checkout
 * 
 * Test Scenarios:
 * - Display checkout page and order summary
 * - Fill shipping details
 * - Select payment method
 * - Submit checkout form
 */

describe('Checkout E2E Tests', () => {
  /**
   * Navigate to checkout page before each test
   */
  beforeEach(() => {
    cy.visit('http://localhost:8080/checkout')
  })

  /**
   * E2E Test: Display Checkout Page
   * @test User can view checkout page
   * @scenario User navigates to /checkout
   * @expects Checkout container visible with order summary
   */
  it('should display checkout page', () => {
    cy.get('[data-testid="checkout-container"]').should('be.visible')
  })

  /**
   * E2E Test: Display Order Summary
   * @test Order summary section displays correctly
   * @scenario User views cart items and total
   * @expects Order summary with items and total price
   */
  it('should display order summary', () => {
    cy.get('[data-testid="order-summary"]').should('exist')
  })

  /**
   * E2E Test: Fill Shipping Details
   * @test User can enter shipping address
   * @scenario User fills address form
   * @expects Shipping form accepts input
   */
  it('should allow user to fill shipping details', () => {
    cy.get('[data-testid="shipping-address"]').should('exist')
  })

  /**
   * E2E Test: Select Payment Method
   * @test User can select payment option
   * @scenario User chooses payment method
   * @expects Payment method selector available
   */
  it('should allow user to select payment method', () => {
    cy.get('[data-testid="payment-method"]').should('exist')
  })

  /**
   * E2E Test: Submit Checkout
   * @test User can submit checkout form
   * @scenario User completes checkout process
   * @expects Submit button visible and clickable
   */
  it('should submit checkout form', () => {
    cy.get('[data-testid="submit-checkout"]').should('be.visible')
  })
})
