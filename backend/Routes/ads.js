import express from 'express'
import { listAds, createAd } from '../Controllers/adsController.js'
import { checkAuth } from '../MiddleWare/authMiddleware.js'

const router = express.Router()

router.get('/', listAds)
router.post('/', checkAuth, createAd)

export default router
