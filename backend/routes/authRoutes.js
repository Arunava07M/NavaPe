import express from 'express'
import { registerUser, loginUser, getProfile } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { strictLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', strictLimiter, loginUser)
router.get('/profile', protect, getProfile)

export default router