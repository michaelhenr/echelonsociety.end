/**
 * Legacy API Exports (Backward Compatibility)
 * 
 * All APIs have been reorganized into separate files in src/services/api/
 * This file re-exports them for backward compatibility.
 * 
 * New code should import from the api/ subdirectory:
 * import { ProductsAPI, OrdersAPI } from '@/services/api';
 */

export {
  ProductsAPI,
  OrdersAPI,
  BrandsAPI,
  AdsAPI,
  AnalyticsAPI,
  NewsletterAPI,
  ClientsAPI,
  ChatAPI,
  type ProductInput,
  type ProductFilters,
  type OrderInput,
  type OrderItem,
  type BrandInput,
  type AdInput,
  type DashboardStats,
} from './api/index';
