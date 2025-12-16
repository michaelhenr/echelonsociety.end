/**
 * Integration Test Setup
 * Configures test database and test environment
 */

import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

// Use test database
const TEST_MONGO_URL = process.env.MONGO_URL?.replace(/\/[^/]+$/, '/echelon-test') || 'mongodb://localhost:27017/echelon-test'

/**
 * Setup before all tests
 */
export async function setupTestDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(TEST_MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      console.log('✅ Test database connected')
    }
  } catch (error) {
    console.error('❌ Failed to connect to test database:', error)
    throw error
  }
}

/**
 * Cleanup after all tests
 */
export async function teardownTestDB() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
      console.log('✅ Test database disconnected')
    }
  } catch (error) {
    console.error('❌ Error disconnecting test database:', error)
  }
}

/**
 * Clear all collections before each test
 */
export async function clearDatabase() {
  if (mongoose.connection.readyState === 0) {
    return // Not connected
  }
  
  const collections = mongoose.connection.collections
  
  for (const key in collections) {
    try {
      await collections[key].deleteMany({})
    } catch (error) {
      // Collection might not exist yet, ignore
    }
  }
}

