import jwt from 'jsonwebtoken'

export const protect = async (req, res, next) => {
  try {
   
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ message: 'not authorized, no token' })
    }


    const token = authHeader.split(' ')[1]


    const decoded = jwt.verify(token, process.env.JWT_SECRET)


    req.userId = decoded.id

    next() 

  } catch (error) {
    console.log('auth middleware error:', error)
    res.status(401).json({ message: 'not authorized, token failed' })
  }
}