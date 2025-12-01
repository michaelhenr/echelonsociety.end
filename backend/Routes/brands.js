import express from 'express'
import { listBrands, createBrand } from '../Controllers/brandsController.js'
import { checkAuth } from '../MiddleWare/authMiddleware.js'

const router = express.Router()

router.get('/', listBrands)
router.post('/', checkAuth, createBrand)

export default router
