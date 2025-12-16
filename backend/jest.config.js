export default {
  testEnvironment: 'node',
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  // Only run tests in __tests__ folder (our new tests)
  // Ignore old test files that use Vitest (they're in Models/, Controllers/, Routes/ directly)
  testMatch: ['**/__tests__/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  collectCoverageFrom: [
    'Controllers/**/*.js',
    'helpers/**/*.js',
    'Models/**/*.js',
    'Routes/**/*.js',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/*.test.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  // Test timeout for integration tests (they may take longer)
  testTimeout: 30000,
  // Run tests serially to avoid database connection conflicts
  maxWorkers: 1
}

