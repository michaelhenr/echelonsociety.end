/**
 * Role Selection E2E Tests
 * @description End-to-end tests for user role selection flow
 * @module cypress/e2e/roleSelection
 * @url http://localhost:8080/role-selection
 * 
 * Test Scenarios:
 * - Display role selection page
 * - Display available role options
 * - Select a role
 * - Navigate after role selection
 */

describe('Role Selection E2E Tests', () => {
  /**
   * Navigate to role selection page before each test
   */
  beforeEach(() => {
    cy.visit('http://localhost:8080/role-selection')
  })

  /**
   * E2E Test: Display Role Selection Page
   * @test Role selection page loads
   * @scenario User navigates to /role-selection
   * @expects Role selection page visible
   */
  it('should display role selection page', () => {
    cy.get('[data-testid="role-selection"]').should('be.visible')
  })

  /**
   * E2E Test: Display Available Roles
   * @test Role options display correctly
   * @scenario User views available roles
   * @expects Multiple role options visible
   */
  it('should display available roles', () => {
    cy.get('[data-testid="role-option"]').should('have.length.greaterThan', 0)
  })

  /**
   * E2E Test: Select a Role
   * @test User can click and select a role
   * @scenario User selects first available role
   * @expects Confirm button appears after selection
   */
  it('should allow selecting a role', () => {
    cy.get('[data-testid="role-option"]').first().click()
    cy.get('[data-testid="confirm-role"]').should('be.visible')
  })

  /**
   * E2E Test: Navigate After Selection
   * @test User navigates after confirming role
   * @scenario User confirms role selection
   * @expects Navigation to next page
   */
  it('should navigate after role selection', () => {
    cy.get('[data-testid="role-option"]').first().click()
    cy.get('[data-testid="confirm-role"]').click()
  })
})
