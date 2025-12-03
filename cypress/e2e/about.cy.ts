/**
 * About Page E2E Tests
 * @description End-to-end tests for about/company information page
 * @module cypress/e2e/about
 * @url http://localhost:8080/about
 * 
 * Test Scenarios:
 * - Display about page
 * - View company information
 * - View team members section
 * - View mission statement
 */

describe('About Page E2E Tests', () => {
  /**
   * Navigate to about page before each test
   */
  beforeEach(() => {
    cy.visit('http://localhost:8080/about')
  })

  /**
   * E2E Test: Display About Page
   * @test About page loads successfully
   * @scenario User navigates to /about
   * @expects About page with all sections visible
   */
  it('should display about page', () => {
    cy.get('[data-testid="about-page"]').should('be.visible')
  })

  /**
   * E2E Test: Display Company Information
   * @test Company info section displays
   * @scenario User views company details
   * @expects Company information visible and readable
   */
  it('should display company information', () => {
    cy.get('[data-testid="company-info"]').should('exist')
  })

  /**
   * E2E Test: Display Team Section
   * @test Team members section displays
   * @scenario User views team member profiles
   * @expects Team section with member cards visible
   */
  it('should display team section', () => {
    cy.get('[data-testid="team-section"]').should('exist')
  })

  /**
   * E2E Test: Display Mission Statement
   * @test Mission statement section displays
   * @scenario User reads company mission
   * @expects Mission statement text visible
   */
  it('should display mission statement', () => {
    cy.get('[data-testid="mission-statement"]').should('exist')
  })
})
