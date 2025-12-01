import express from 'express'
import { listOrders, createOrder } from '../Controllers/ordersController.js'
import { checkAuth } from '../MiddleWare/authMiddleware.js'

const router = express.Router()

router.get('/', checkAuth, listOrders)
router.post('/', createOrder)

export default router
