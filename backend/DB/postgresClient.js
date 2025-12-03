import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

/**
 * PostgreSQL Database Connection Pool
 * Connects to Supabase PostgreSQL database
 * 
 * Environment Variables:
 * - DATABASE_URL: PostgreSQL connection string from Supabase
 *   Format: postgresql://user:password@host:port/database
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase connection
  },
});

/**
 * Singleton PostgreSQL Connection Manager
 * Ensures single connection pool instance across application
 */
class PostgresConnect {
  static instance = null;

  static getInstance() {
    if (!PostgresConnect.instance) {
      PostgresConnect.instance = new PostgresConnect();
    }
    return PostgresConnect.instance;
  }

  /**
   * Connect to PostgreSQL database
   * Creates connection pool if not already connected
   */
  async connect() {
    try {
      // Test connection by running a simple query
      const result = await pool.query('SELECT NOW()');
      console.log('✅ PostgreSQL connected successfully at:', result.rows[0].now);
      return pool;
    } catch (error) {
      console.error('❌ PostgreSQL connection error:', error.message);
      throw error;
    }
  }

  /**
   * Execute a query on the connection pool
   * @param {string} query - SQL query string
   * @param {array} values - Query parameters
   * @returns {Promise<object>} Query result
   */
  async query(query, values) {
    try {
      const result = await pool.query(query, values);
      return result;
    } catch (error) {
      console.error('❌ Query error:', error.message);
      throw error;
    }
  }

  /**
   * Close the connection pool
   */
  async close() {
    try {
      await pool.end();
      console.log('✅ PostgreSQL connection pool closed');
    } catch (error) {
      console.error('❌ Error closing connection pool:', error.message);
    }
  }

  /**
   * Get raw pool instance for advanced usage
   */
  getPool() {
    return pool;
  }
}

// Export singleton instance
export default PostgresConnect;
