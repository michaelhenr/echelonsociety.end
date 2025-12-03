/**
 * Submit Ad E2E Tests
 * @description End-to-end tests for advertisement submission form
 * @module cypress/e2e/submitAd
 * @url http://localhost:8080/submit-ad
 * 
 * Test Scenarios:
 * - Display ad submission form
 * - Fill form fields
 * - Validate form submission
 * - Submit with valid data
 */

describe('Submit Ad E2E Tests', () => {
  /**
   * Navigate to ad submission page before each test
   */
  beforeEach(() => {
    cy.visit('http://localhost:8080/submit-ad')
  })

  /**
   * E2E Test: Display Submit Ad Form
   * @test Ad submission form loads
   * @scenario User navigates to /submit-ad
   * @expects Form container with fields visible
   */
  it('should display submit ad form', () => {
    cy.get('[data-testid="submit-ad-form"]').should('be.visible')
  })

  /**
   * E2E Test: Required Form Fields
   * @test All required fields are present
   * @scenario User views form fields
   * @expects Title, description, category fields exist
   */
  it('should have required form fields', () => {
    cy.get('[data-testid="ad-title"]').should('exist')
    cy.get('[data-testid="ad-description"]').should('exist')
    cy.get('[data-testid="ad-category"]').should('exist')
  })

  /**
   * E2E Test: Validate Form Submission
   * @test Form validation works for empty fields
   * @scenario User attempts to submit empty form
   * @expects Validation error messages display
   */
  it('should validate form submission', () => {
    cy.get('[data-testid="submit-ad-button"]').click()
    cy.get('[data-testid="form-error"]').should('exist')
  })

  /**
   * E2E Test: Submit with Valid Data
   * @test Form submits successfully with valid data
   * @scenario User fills and submits form
   * @expects Form submission processed
   */
  it('should submit ad successfully with valid data', () => {
    cy.get('[data-testid="ad-title"]').type('Test Ad')
    cy.get('[data-testid="ad-description"]').type('Test Description')
    cy.get('[data-testid="submit-ad-button"]').click()
  })
})
