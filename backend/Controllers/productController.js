import Product from '../Models/Product.js'

export async function listProducts(req, res) {
  try {
    // Only show approved products to regular users, admins can see all
    // Check if user is authenticated and is admin
    const isAdmin = req.user && req.user.role === 'admin'
    const query = isAdmin ? {} : { status: 'approved' }
    const products = await Product.find(query).populate('brand_id', 'name').lean()
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to fetch products' })
  }
}

export async function createProduct(req, res) {
  try {
    // Validate required fields
    if (!req.body.image_url) {
      return res.status(400).json({ error: 'Image URL is required' })
    }
    const doc = new Product(req.body)
    const data = await doc.save()
    
    // Create notification for admin
    const { createNotification } = await import('../helpers/createNotification.js')
    await createNotification(
      'product',
      'New Product Submitted',
      `A new product "${data.name}" has been submitted and is pending approval`
    )
    
    res.status(201).json(data)
  } catch (err) {
    console.error(err)
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message })
    }
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

export async function updateProduct(req, res) {
  try {
    const { id } = req.params
    const updateData = { ...req.body, updated_at: new Date() }
    const product = await Product.findByIdAndUpdate(id, updateData, { new: true })
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to update product' })
  }
}

export async function approveProduct(req, res) {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'Product ID is required' })
    }
    const product = await Product.findByIdAndUpdate(id, { status: 'approved', updated_at: new Date() }, { new: true })
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(product)
  } catch (err) {
    console.error('Approve product error:', err)
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid product ID format' })
    }
    res.status(500).json({ error: 'Unable to approve product' })
  }
}

export async function rejectProduct(req, res) {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'Product ID is required' })
    }
    const product = await Product.findByIdAndUpdate(id, { status: 'rejected', updated_at: new Date() }, { new: true })
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(product)
  } catch (err) {
    console.error('Reject product error:', err)
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid product ID format' })
    }
    res.status(500).json({ error: 'Unable to reject product' })
  }
}
