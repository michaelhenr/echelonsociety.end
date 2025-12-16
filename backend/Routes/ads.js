import express from 'express'
import { listAds, createAd, acceptAd, rejectAd } from '../Controllers/adsController.js'
import { checkAuth } from '../MiddleWare/authMiddleware.js'

const router = express.Router()

// Specific routes must come before generic :id routes
router.patch('/:id/accept', checkAuth, (req, res, next) => {
  console.log('✅ Accept ad route hit:', req.params.id)
  next()
}, acceptAd)

router.patch('/:id/reject', checkAuth, (req, res, next) => {
  console.log('✅ Reject ad route hit:', req.params.id)
  next()
}, rejectAd)

router.get('/', listAds)
router.post('/', createAd)

export default router
