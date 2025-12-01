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
import { ensureSeedProducts } from './helpers/seedProducts.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xssClean());

app.get('/', (req, res) => res.send('test'));

// Define your MongoDB connection URL and server port
const URL = process.env.MONGO_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/E-Shop';
const PORT = process.env.PORT || 3400;

// Add routes
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);
app.use('/notifications', notificationRoutes);
app.use('/chat', chatRouter);

// Start function using MongoConnect Singleton
const start = async () => {
	try {
		const dbInstance = MongoConnect.getInstance();
		await dbInstance.connect(URL);
		await ensureSeedProducts(Product);
		app.listen(PORT, () => {
			console.log(`Server is listening on port ${PORT}`);
		});
	} catch (error) {
		console.error('Error connecting to the database or starting the server:', error);
	}
};

start();
