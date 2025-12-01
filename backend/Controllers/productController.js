import Product from '../Models/Product.js'

export async function listProducts(req, res) {
  try {
    const products = await Product.find().lean()
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to fetch products' })
  }
}

export async function createProduct(req, res) {
  try {
    const doc = new Product(req.body)
    const data = await doc.save()
    res.status(201).json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to create product' })
  }
}

export async function deleteProduct(req, res) {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to delete product' })
  }
}
