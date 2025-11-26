/**
 * Central API Service Exports
 * 
 * This module provides a clean, organized interface to all backend services.
 * Each service is implemented as a separate class following the Facade Pattern.
 * 
 * Usage:
 * import { ProductsAPI, OrdersAPI, BrandsAPI } from '@/services/api';
 * 
 * const products = await ProductsAPI.list();
 * const order = await OrdersAPI.create(orderData);
 */

export { ProductsAPI, type ProductInput, type ProductFilters } from './ProductsAPI';
export { OrdersAPI, type OrderInput, type OrderItem } from './OrdersAPI';
export { BrandsAPI, type BrandInput } from './BrandsAPI';
export { AdsAPI, type AdInput } from './AdsAPI';
export { AnalyticsAPI, type DashboardStats } from './AnalyticsAPI';
export { NewsletterAPI } from './NewsletterAPI';
export { ClientsAPI } from './ClientsAPI';
export { ChatAPI } from './ChatAPI';
