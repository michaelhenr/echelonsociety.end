import express from 'express'
import { chatHandler } from '../Controllers/chatController.js'

const router = express.Router()

router.post('/', chatHandler)

export default router
import express from 'express'
import { chatHandler } from '../Controllers/chatController.js'

const router = express.Router()

router.post('/', chatHandler)

export default router
