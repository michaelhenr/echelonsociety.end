import express from 'express'
import { listProducts, createProduct, removeProduct } from '../Controllers/productsController.js'
import { checkAuth } from '../MiddleWare/authMiddleware.js'

const router = express.Router()

router.get('/', listProducts)
router.post('/', checkAuth, createProduct)
router.delete('/:id', checkAuth, removeProduct)

export default router
