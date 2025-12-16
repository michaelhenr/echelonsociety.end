import express from 'express'
import { listBrands, createBrand, acceptBrand, rejectBrand } from '../Controllers/brandsController.js'
import { checkAuth } from '../MiddleWare/authMiddleware.js'

const router = express.Router()

// Specific routes must come before generic routes
router.patch('/:id/accept', checkAuth, (req, res, next) => {
  console.log('✅ Accept brand route hit:', req.params.id)
  next()
}, acceptBrand)

router.patch('/:id/reject', checkAuth, (req, res, next) => {
  console.log('✅ Reject brand route hit:', req.params.id)
  next()
}, rejectBrand)

router.get('/', listBrands)
router.post('/', createBrand)

export default router
