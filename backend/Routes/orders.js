import express from 'express'
import { listOrders, createOrder, acceptOrder, rejectOrder } from '../Controllers/ordersController.js'
import { checkAuth } from '../MiddleWare/authMiddleware.js'

const router = express.Router()

// Specific routes must come before generic routes
router.patch('/:id/accept', checkAuth, (req, res, next) => {
  console.log('✅ Accept order route hit:', req.params.id)
  next()
}, acceptOrder)

router.patch('/:id/reject', checkAuth, (req, res, next) => {
  console.log('✅ Reject order route hit:', req.params.id)
  next()
}, rejectOrder)

router.get('/', checkAuth, listOrders)
router.post('/', createOrder)

export default router
