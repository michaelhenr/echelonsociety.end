import Product from '../Models/Product.js'

/**
 * Seed products function - only runs if database is empty
 * Note: Products must be created through the API with image URLs
 * This is only for initial database setup if needed
 */
export async function ensureSeedProducts(ProductModel = Product) {
  const count = await ProductModel.countDocuments()
  if (count === 0) {
    // Database is empty - products should be created through the API
    // with proper image URLs provided by users/admins
    console.log('Database is empty. Products should be created through the API with image URLs.')
  }
}
