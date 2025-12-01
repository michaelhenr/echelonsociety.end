import express from 'express'
import { listNotifications, createNotification } from '../Controllers/notificationController.js'
import { checkAuth } from '../MiddleWare/authMiddleware.js'

const router = express.Router()

router.get('/', listNotifications)
router.post('/', checkAuth, createNotification)

export default router
