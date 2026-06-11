import User from '../models/User.js'

export const lookupUser = async (req, res) => {
  try {
    const { phone } = req.query

    if (!phone) {
      return res.status(400).json({ message: 'phone number required' })
    }

    const user = await User.findOne({
      where: { phone },
      attributes: ['id', 'name', 'phone'] 
    })

    if (!user) {
      return res.status(404).json({ message: 'no user found with this phone number' })
    }


    if (user.id === req.userId) {
      return res.status(400).json({ message: 'you cannot send money to yourself' })
    }

    res.status(200).json({ user })

  } catch (error) {
    console.log('lookup user error:', error)
    res.status(500).json({ message: 'something went wrong' })
  }
}