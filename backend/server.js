import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import xssClean from 'xss-clean';
import dotenv from 'dotenv';
import MongoConnect from './DB/MongoConnect.js';
import Product from './Models/Product.js';
import userRoutes from './Routes/user.js';
import productRoutes from './Routes/product.js';
import cartRoutes from './Routes/orders.js';
import notificationRoutes from './Routes/Notification.js';
import chatRouter from './Routes/chat.js';
import brandsRoutes from './Routes/brands.js';
import adsRoutes from './Routes/ads.js';
import unsplashRoutes from './Routes/unsplash.js';
import { ensureSeedProducts } from './helpers/seedProducts.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xssClean());

/**
 * Health Check Endpoint
 */
app.get('/', (req, res) => res.send('test'));

/**
 * Health Check for Databases
 */
app.get('/health', async (req, res) => {
	try {
		res.json({
			status: '✅ OK',
			message: 'Server is running',
			timestamp: new Date().toISOString(),
			port: PORT,
			environment: process.env.NODE_ENV || 'development'
		});
	} catch (error) {
		res.status(500).json({
			status: '❌ Error',
			message: error.message
		});
	}
});

// Define your database connection URLs and server port
const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/E-Shop';
const PORT = process.env.PORT || 3400;

// Add routes
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);
app.use('/notifications', notificationRoutes);
app.use('/chat', chatRouter);
app.use('/brands', brandsRoutes);
app.use('/ads', adsRoutes);
app.use('/unsplash', unsplashRoutes);

/**
 * Start function - Initialize MongoDB
 * 
 * Environment Variables:
 * - MONGO_URL: MongoDB connection string
 * - PORT: Server port (default: 3400)
 */
const start = async () => {
	try {
		console.log('\n🚀 Starting Echelon Society API Server...\n');

		// Connect to MongoDB
		console.log('📍 Connecting to MongoDB...');
		const mongoInstance = MongoConnect.getInstance();
		await mongoInstance.connect(MONGO_URL);
		console.log('✅ MongoDB connected successfully\n');

		// Seed MongoDB products
		console.log('🌱 Ensuring seed products in MongoDB...');
		await ensureSeedProducts(Product);
		console.log('✅ Seed products initialized\n');

		// Start the server
		app.listen(PORT, () => {
			console.log(`${'='.repeat(60)}`);
			console.log(`✅ Server is running on port ${PORT}`);
			console.log(`${'='.repeat(60)}`);
			console.log(`\n📊 Available Endpoints:`);
			console.log(`   GET  http://localhost:${PORT}/              (Health)`);
			console.log(`   GET  http://localhost:${PORT}/health       (Detailed Health)`);
			console.log(`   POST http://localhost:${PORT}/user/*       (User routes)`);
			console.log(`   GET  http://localhost:${PORT}/product/*    (Product routes)`);
			console.log(`   POST http://localhost:${PORT}/cart/*       (Order routes)`);
			console.log(`   POST http://localhost:${PORT}/notifications/* (Notification routes)`);
			console.log(`   POST http://localhost:${PORT}/chat/*       (Chat routes)\n`);
			console.log(`📦 Database:`);
			console.log(`   MongoDB:     ${MONGO_URL.split('/').pop() || 'E-Shop'}`);
			console.log(`${'='.repeat(60)}\n`);
		});
	} catch (error) {
		console.error('❌ Error starting server:', error.message);
		console.error('\nTroubleshooting:');
		console.error('1. Check MongoDB connection: MONGO_URL environment variable');
		console.error('2. Verify .env file exists with required variables');
		process.exit(1);
	}
};

start();

// Graceful shutdown
process.on('SIGTERM', () => {
	console.log('\n⚠️  SIGTERM received, shutting down gracefully...');
	process.exit(0);
});

process.on('SIGINT', () => {
	console.log('\n⚠️  SIGINT received, shutting down gracefully...');
	process.exit(0);
});
