import Product from './Product.js'

export async function getProducts(){
  const products = await Product.find()
  return products
}

export async function createProduct(productData){
  const product = new Product(productData)
  const savedProduct = await product.save()
  return savedProduct
}

export async function deleteProduct(id){
  const deletedProduct = await Product.findByIdAndDelete(id)
  return deletedProduct
}
