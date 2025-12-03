import PostgresConnect from '../DB/postgresClient.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * PostgreSQL Data Initialization
 * Creates tables and seeds initial data in Supabase PostgreSQL database
 */

const dbManager = PostgresConnect.getInstance();

/**
 * Create all necessary tables
 */
async function createTables() {
  try {
    console.log('🔨 Creating PostgreSQL tables...');

    // Users table
    await dbManager.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE,
        full_name VARCHAR(255),
        profile_image VARCHAR(500),
        role VARCHAR(50) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Products table
    await dbManager.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(500),
        category VARCHAR(100),
        stock INT DEFAULT 0,
        rating DECIMAL(3, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Products table created');

    // Orders table
    await dbManager.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT,
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Orders table created');

    // Order Items table
    await dbManager.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Order Items table created');

    // Notifications table
    await dbManager.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Notifications table created');

    // Chat Messages table
    await dbManager.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Chat Messages table created');

    // Ads table
    await dbManager.query(`
      CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Ads table created');

    // Brands table
    await dbManager.query(`
      CREATE TABLE IF NOT EXISTS brands (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        logo VARCHAR(500),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Brands table created');

    console.log('✅ All tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  }
}

/**
 * Seed initial data into tables
 */
async function seedData() {
  try {
    console.log('🌱 Seeding initial data...');

    // Check if users exist
    const usersCheck = await dbManager.query('SELECT COUNT(*) FROM users');
    if (usersCheck.rows[0].count > 0) {
      console.log('⏭️  Users already exist, skipping seed');
      return;
    }

    // Seed sample users
    await dbManager.query(`
      INSERT INTO users (email, password, username, full_name, role)
      VALUES 
        ('admin@echelon.com', 'hashed_password_123', 'admin', 'Admin User', 'admin'),
        ('user1@echelon.com', 'hashed_password_456', 'user1', 'John Doe', 'customer'),
        ('user2@echelon.com', 'hashed_password_789', 'user2', 'Jane Smith', 'customer')
    `);
    console.log('✅ Users seeded');

    // Seed sample products
    await dbManager.query(`
      INSERT INTO products (name, description, price, category, stock, rating)
      VALUES 
        ('Laptop Pro', 'High-performance laptop for professionals', 1299.99, 'Electronics', 10, 4.8),
        ('Wireless Mouse', 'Ergonomic wireless mouse with long battery life', 29.99, 'Accessories', 50, 4.5),
        ('USB-C Cable', 'Fast charging USB-C cable', 12.99, 'Accessories', 100, 4.3),
        ('Monitor 4K', '27-inch 4K Ultra HD monitor', 399.99, 'Electronics', 8, 4.7),
        ('Mechanical Keyboard', 'Gaming mechanical keyboard with RGB lights', 89.99, 'Accessories', 25, 4.6)
    `);
    console.log('✅ Products seeded');

    // Seed sample brands
    await dbManager.query(`
      INSERT INTO brands (name, description)
      VALUES 
        ('TechCorp', 'Leading technology brand'),
        ('ElectroHub', 'Premium electronics retailer'),
        ('AccessoryMax', 'Accessories and peripherals specialist')
    `);
    console.log('✅ Brands seeded');

    console.log('✅ All data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    throw error;
  }
}

/**
 * Initialize database - create tables and seed data
 */
export async function initializePostgresDB() {
  try {
    console.log('🚀 Starting PostgreSQL database initialization...\n');
    
    // Connect to database
    await dbManager.connect();
    
    // Create tables
    await createTables();
    
    // Seed data
    await seedData();
    
    console.log('\n✅ PostgreSQL database initialized successfully!\n');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  initializePostgresDB()
    .then(() => {
      console.log('✅ Setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}
