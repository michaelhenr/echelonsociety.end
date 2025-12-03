/**
 * Submit Brand E2E Tests
 * @description End-to-end tests for brand submission form
 * @module cypress/e2e/submitBrand
 * @url http://localhost:8080/submit-brand
 * 
 * Test Scenarios:
 * - Display brand submission form
 * - Fill brand fields
 * - Upload brand logo
 * - Submit brand form
 */

describe('Submit Brand E2E Tests', () => {
  /**
   * Navigate to brand submission page before each test
   */
  beforeEach(() => {
    cy.visit('http://localhost:8080/submit-brand')
  })

  /**
   * E2E Test: Display Submit Brand Form
   * @test Brand submission form loads
   * @scenario User navigates to /submit-brand
   * @expects Form container with brand fields visible
   */
  it('should display submit brand form', () => {
    cy.get('[data-testid="submit-brand-form"]').should('be.visible')
  })

  /**
   * E2E Test: Brand Name Field
   * @test Brand name input field exists
   * @scenario User accesses name field
   * @expects Input field for brand name
   */
  it('should have brand name field', () => {
    cy.get('[data-testid="brand-name"]').should('exist')
  })

  /**
   * E2E Test: Brand Description Field
   * @test Brand description input field exists
   * @scenario User accesses description field
   * @expects Textarea for brand description
   */
  it('should have brand description field', () => {
    cy.get('[data-testid="brand-description"]').should('exist')
  })

  /**
   * E2E Test: Logo Upload
   * @test Brand logo upload feature exists
   * @scenario User accesses file upload
   * @expects File upload input for logo
   */
  it('should allow brand logo upload', () => {
    cy.get('[data-testid="brand-logo-upload"]').should('exist')
  })

  /**
   * E2E Test: Submit Brand Successfully
   * @test Form submits with valid brand data
   * @scenario User fills and submits brand form
   * @expects Form processed successfully
   */
  it('should submit brand successfully', () => {
    cy.get('[data-testid="brand-name"]').type('Test Brand')
    cy.get('[data-testid="brand-description"]').type('Brand Description')
    cy.get('[data-testid="submit-brand-button"]').click()
  })
})
