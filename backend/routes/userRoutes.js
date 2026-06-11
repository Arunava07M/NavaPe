import express from 'express'
import { lookupUser } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/lookup', protect, lookupUser)

export default router