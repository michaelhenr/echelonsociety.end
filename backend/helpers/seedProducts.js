import Product from '../Models/Product.js'

const seedProductsList = [
  {
    name: 'Nebula Wireless Headphones',
    description: 'Immersive spatial audio with adaptive noise control.',
    price: 249.99,
    stock: 35,
  },
  {
    name: 'Aurora Smart Lamp',
    description: 'Gradient RGB lighting with voice and motion automation.',
    price: 129.0,
    stock: 60,
  },
  {
    name: 'Lumen Home Hub',
    description: 'Privacy-first smart home controller with edge AI.',
    price: 199.0,
    stock: 42,
  },
  {
    name: 'Pulse Fitness Band',
    description: 'Carbon fiber wearable with biofeedback sensors.',
    price: 179.0,
    stock: 75,
  },
  {
    name: 'Orbit Drone Mini',
    description: '4K stabilized camera drone that fits in your palm.',
    price: 299.0,
    stock: 20,
  },
  {
    name: 'Flux Portable Projector',
    description: 'Laser projection with HDR10 and ultra-short throw.',
    price: 449.0,
    stock: 18,
  },
]

export async function ensureSeedProducts(ProductModel = Product) {
  const count = await ProductModel.countDocuments()
  if (count === 0) {
    await ProductModel.insertMany(seedProductsList)
    console.log('Seeded default products for onboarding.')
  }
}
