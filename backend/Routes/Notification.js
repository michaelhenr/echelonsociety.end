import express from 'express'
import { listNotifications, createNotification, getUnreadCount, markAsRead } from '../Controllers/notificationController.js'
import { checkAuth } from '../MiddleWare/authMiddleware.js'

const router = express.Router()

router.get('/', checkAuth, listNotifications)
router.get('/unread-count', checkAuth, getUnreadCount)
router.patch('/:id/read', checkAuth, markAsRead)
router.patch('/all/read', checkAuth, markAsRead)
router.post('/', createNotification) // Allow creating without auth (for client actions)

export default router
