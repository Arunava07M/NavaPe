import rateLimit from 'express-rate-limit'

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: { message: 'Too many attempts. Please try again after 15 minutes for security reasons.' },
  standardHeaders: true, 
  legacyHeaders: false, 
})