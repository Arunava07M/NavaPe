import express from 'express'
import { createPaymentOrder, mockConfirmPayment, verifyPayment, transferMoney } from '../controllers/walletController.js'
import { protect } from '../middleware/authMiddleware.js'
import { strictLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/create-order', protect, createPaymentOrder)
router.post('/mock-confirm', protect, mockConfirmPayment)
router.post('/verify-payment', protect, verifyPayment)
router.post('/transfer', protect, strictLimiter, transferMoney)

export default router