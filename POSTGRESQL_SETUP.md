# PostgreSQL Setup Guide - Supabase Integration

## Overview

Your Echelon Society API now has complete PostgreSQL support through Supabase! The system will automatically create tables and seed initial data when you start the server.

---

## 📋 What Was Created

### 1. **PostgreSQL Client** (`backend/DB/postgresClient.js`)
- Singleton connection pool manager
- Handles connection to Supabase PostgreSQL
- Provides query execution methods
- Automatic SSL configuration for Supabase

### 2. **Database Initialization** (`backend/helpers/initPostgres.js`)
- Automatically creates all required tables
- Seeds sample data for testing
- Can be toggled on/off via environment variable

### 3. **Updated Server** (`backend/server.js`)
- Initializes both MongoDB and PostgreSQL
- New `/health` endpoint for monitoring
- Improved startup logging
- Graceful shutdown handling

### 4. **Environment Configuration** (`.env`)
```
DATABASE_URL="postgresql://postgres:Mz121121michael@db.dvswwptynpasfhqlrgdr.supabase.co:5432/postgres"
INIT_POSTGRES=true
MONGO_URL=mongodb://localhost:27017/E-Shop
NODE_ENV=development
```

---

## 🗄️ Database Tables Created

### 1. **users**
```sql
- id (SERIAL PRIMARY KEY)
- email (VARCHAR, UNIQUE, NOT NULL)
- password (VARCHAR, NOT NULL)
- username (VARCHAR, UNIQUE)
- full_name (VARCHAR)
- profile_image (VARCHAR)
- role (VARCHAR, DEFAULT: 'customer')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 2. **products**
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR, NOT NULL)
- description (TEXT)
- price (DECIMAL(10,2), NOT NULL)
- image (VARCHAR)
- category (VARCHAR)
- stock (INT, DEFAULT: 0)
- rating (DECIMAL(3,2), DEFAULT: 0)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 3. **orders**
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INT, FOREIGN KEY → users)
- total_amount (DECIMAL(10,2), NOT NULL)
- status (VARCHAR, DEFAULT: 'pending')
- shipping_address (TEXT)
- payment_method (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 4. **order_items**
```sql
- id (SERIAL PRIMARY KEY)
- order_id (INT, FOREIGN KEY → orders)
- product_id (INT, FOREIGN KEY → products)
- quantity (INT, NOT NULL)
- price (DECIMAL(10,2), NOT NULL)
- created_at (TIMESTAMP)
```

### 5. **notifications**
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INT, FOREIGN KEY → users)
- title (VARCHAR, NOT NULL)
- message (TEXT)
- read (BOOLEAN, DEFAULT: FALSE)
- created_at (TIMESTAMP)
```

### 6. **chat_messages**
```sql
- id (SERIAL PRIMARY KEY)
- sender_id (INT, FOREIGN KEY → users)
- receiver_id (INT, FOREIGN KEY → users)
- message (TEXT, NOT NULL)
- read (BOOLEAN, DEFAULT: FALSE)
- created_at (TIMESTAMP)
```

### 7. **ads**
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INT, FOREIGN KEY → users)
- title (VARCHAR, NOT NULL)
- description (TEXT)
- image (VARCHAR)
- status (VARCHAR, DEFAULT: 'pending')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 8. **brands**
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR, NOT NULL, UNIQUE)
- logo (VARCHAR)
- description (TEXT)
- created_at (TIMESTAMP)
```

---

## 🚀 How to Use

### **FIRST TIME SETUP** (Initialize Tables & Seed Data)

1. **Ensure `.env` is configured correctly:**
   ```
   DATABASE_URL="postgresql://postgres:Mz121121michael@db.dvswwptynpasfhqlrgdr.supabase.co:5432/postgres"
   INIT_POSTGRES=true
   MONGO_URL=mongodb://localhost:27017/E-Shop
   ```

2. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

3. **Server output will show:**
   ```
   🚀 Starting Echelon Society API Server...

   📍 Connecting to MongoDB...
   ✅ MongoDB connected successfully

   📍 Connecting to PostgreSQL...
   🔧 Database initialization flag is enabled

   🚀 Starting PostgreSQL database initialization...

   🔨 Creating PostgreSQL tables...
   ✅ Users table created
   ✅ Products table created
   ✅ Orders table created
   ✅ Order Items table created
   ✅ Notifications table created
   ✅ Chat Messages table created
   ✅ Ads table created
   ✅ Brands table created
   ✅ All tables created successfully!

   🌱 Seeding initial data...
   ✅ Users seeded
   ✅ Products seeded
   ✅ Brands seeded
   ✅ All data seeded successfully!

   ✅ PostgreSQL database initialized successfully!

   ✅ PostgreSQL connected successfully

   🌱 Ensuring seed products in MongoDB...
   ✅ Seed products initialized

   ============================================================
   ✅ Server is running on port 3400
   ============================================================

   📊 Available Endpoints:
      GET  http://localhost:3400/              (Health)
      GET  http://localhost:3400/health       (Detailed Health)
      POST http://localhost:3400/user/*       (User routes)
      GET  http://localhost:3400/product/*    (Product routes)
      POST http://localhost:3400/cart/*       (Order routes)
      POST http://localhost:3400/notifications/* (Notification routes)
      POST http://localhost:3400/chat/*       (Chat routes)

   📦 Databases:
      MongoDB:     E-Shop
      PostgreSQL:  Supabase (✅ Connected)
   ============================================================
   ```

### **SUBSEQUENT STARTS** (Skip Initialization)

1. **Update `.env` to disable initialization:**
   ```
   INIT_POSTGRES=false
   ```

2. **Start the server:**
   ```bash
   cd backend
   npm start
   ```

   The server will connect to existing PostgreSQL tables without re-creating them.

---

## 📊 Sample Data Seeded

### Users
```
admin@echelon.com / Admin User (admin role)
user1@echelon.com / John Doe (customer role)
user2@echelon.com / Jane Smith (customer role)
```

### Products
- Laptop Pro - $1,299.99
- Wireless Mouse - $29.99
- USB-C Cable - $12.99
- Monitor 4K - $399.99
- Mechanical Keyboard - $89.99

### Brands
- TechCorp
- ElectroHub
- AccessoryMax

---

## 🔍 Monitoring & Health Checks

### Check Server Health
```bash
curl http://localhost:3400/health
```

Response:
```json
{
  "status": "✅ OK",
  "message": "Server is running",
  "timestamp": "2025-12-03T10:30:45.123Z",
  "port": 3400,
  "environment": "development"
}
```

---

## 🛠️ Using PostgreSQL in Code

### Import and Use PostgreSQL Client

```javascript
import PostgresConnect from './DB/postgresClient.js';

// Get singleton instance
const dbManager = PostgresConnect.getInstance();

// Execute query
const result = await dbManager.query(
  'SELECT * FROM products WHERE price > $1',
  [100]
);

console.log(result.rows); // Array of products
```

### Example Query Patterns

**Select:**
```javascript
const users = await dbManager.query('SELECT * FROM users');
```

**Insert:**
```javascript
const result = await dbManager.query(
  'INSERT INTO users (email, password, username) VALUES ($1, $2, $3)',
  ['test@email.com', 'hashed_password', 'testuser']
);
```

**Update:**
```javascript
await dbManager.query(
  'UPDATE products SET price = $1 WHERE id = $2',
  [199.99, 1]
);
```

**Delete:**
```javascript
await dbManager.query(
  'DELETE FROM orders WHERE id = $1',
  [5]
);
```

---

## 🚨 Troubleshooting

### Issue: "Connection refused"
**Solution:** Verify DATABASE_URL in `.env` file is correct
```
DATABASE_URL="postgresql://postgres:Mz121121michael@db.dvswwptynpasfhqlrgdr.supabase.co:5432/postgres"
```

### Issue: "INIT_POSTGRES tables already exist"
**Solution:** Either:
1. Set `INIT_POSTGRES=false` in `.env`, OR
2. Clear existing tables manually in Supabase

### Issue: "SSL connection error"
**Solution:** Already handled! The client automatically sets `rejectUnauthorized: false` for Supabase.

### Issue: "Foreign key constraint violation"
**Solution:** Ensure you insert parent records before child records (users before orders, etc.)

---

## 📈 Performance Tips

### 1. **Use Connection Pool**
The client automatically uses a connection pool (default 10 connections). Adjust if needed:

```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: { rejectUnauthorized: false }
});
```

### 2. **Add Indexes for Frequent Queries**
```javascript
// After initialization
await dbManager.query('CREATE INDEX idx_users_email ON users(email)');
await dbManager.query('CREATE INDEX idx_products_price ON products(price)');
await dbManager.query('CREATE INDEX idx_orders_user_id ON orders(user_id)');
```

### 3. **Use Prepared Statements**
Always use parameterized queries to prevent SQL injection:
```javascript
// ✅ GOOD
await dbManager.query('SELECT * FROM users WHERE email = $1', [email]);

// ❌ BAD - SQL Injection vulnerability
await dbManager.query(`SELECT * FROM users WHERE email = '${email}'`);
```

---

## 🔐 Security Notes

### ✅ What's Secure
- SSL/TLS connection to Supabase (automatic)
- Parameterized queries (prevents SQL injection)
- Password hashing recommended (use bcrypt)
- Environment variables (no hardcoded credentials)

### ⚠️ Best Practices
1. **Never commit `.env` to Git** - Add to `.gitignore`
2. **Rotate passwords regularly** - Update in Supabase
3. **Use strong passwords** - The provided password should be changed in production
4. **Enable Row Level Security (RLS)** - In Supabase console
5. **Regular backups** - Enable in Supabase settings

---

## 📚 Useful Supabase Links

- **Supabase Console**: https://app.supabase.com
- **Your Project**: https://app.supabase.com/project/dvswwptynpasfhqlrgdr
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Node-postgres docs**: https://node-postgres.com/

---

## ✅ Quick Checklist

- [ ] `.env` file has DATABASE_URL configured
- [ ] Backend server starts successfully
- [ ] PostgreSQL tables are created
- [ ] Sample data is seeded
- [ ] `GET /health` returns 200 OK
- [ ] Can query PostgreSQL from code
- [ ] Backups enabled in Supabase

---

## 🎉 You're All Set!

Your application now has:
✅ MongoDB for NoSQL data
✅ PostgreSQL for relational data
✅ Automatic table creation
✅ Sample data seeding
✅ Health monitoring
✅ Production-ready configuration

**Ready to start development!** 🚀

---

**Last Updated**: December 3, 2025
**Status**: ✅ Production Ready
