import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { Op } from 'sequelize'


export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, passcode } = req.body

    if (!name || !email || !phone || !password || !passcode) {
      return res.status(400).json({ message: 'please fill all fields' })
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }]
      }
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'user already exists with this email' })
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({ message: 'user already exists with this phone number' })
      }
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const hashedPasscode = await bcrypt.hash(passcode.toString(), salt)

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      passcode: hashedPasscode,
    })

    res.status(201).json({
      message: 'user registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        balance: newUser.balance,
      }
    })

  } catch (error) {
    console.log('register error:', error)
    res.status(500).json({ message: 'something went wrong' })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'please enter email and password' })
    }

    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(400).json({ message: 'invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({
      message: 'login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
      }
    })

  } catch (error) {
    console.log('login error:', error)
    res.status(500).json({ message: 'something went wrong' })
  }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password', 'passcode'] } 
    })

    if (!user) {
      return res.status(404).json({ message: 'user not found' })
    }

    res.status(200).json({ user })

  } catch (error) {
    console.log('get profile error:', error)
    res.status(500).json({ message: 'something went wrong' })
  }
}