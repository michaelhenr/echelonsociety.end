import express from 'express'
import { listProducts, createProduct, deleteProduct } from '../Controllers/productController.js'
import { checkAuth } from '../MiddleWare/authMiddleware.js'

const router = express.Router()

router.get('/', listProducts)
router.post('/', checkAuth, createProduct)
router.delete('/:id', checkAuth, deleteProduct)

export default router
