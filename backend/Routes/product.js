import express from 'express'
import jwt from 'jsonwebtoken'
import { listProducts, createProduct, deleteProduct, updateProduct, approveProduct, rejectProduct } from '../Controllers/productController.js'
import { checkAuth } from '../MiddleWare/authMiddleware.js'

const router = express.Router()

// Public endpoint, but can accept optional auth to show all products for admins
router.get('/', (req, res, next) => {
  // Try to decode token if present, but don't require it
  const token = req.headers['authorization']?.split('Bearer ')?.[1]
  if (token) {
    try {
      const decoded = jwt.decode(token)
      req.user = decoded
    } catch (err) {
      // Ignore invalid tokens for public endpoint
    }
  }
  next()
}, listProducts)
router.post('/', createProduct)

// Specific routes must come before generic :id routes
// Log route registration
console.log('📝 Registering product routes:')
console.log('   PATCH /:id/approve')
console.log('   PATCH /:id/reject')

router.patch('/:id/approve', checkAuth, (req, res, next) => {
  console.log('✅ Approve route hit:', req.params.id)
  next()
}, approveProduct)

router.patch('/:id/reject', checkAuth, (req, res, next) => {
  console.log('✅ Reject route hit:', req.params.id)
  next()
}, rejectProduct)

router.put('/:id', checkAuth, updateProduct)
router.delete('/:id', checkAuth, deleteProduct)

export default router
