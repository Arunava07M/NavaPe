import Transaction from '../models/Transaction.js'
import User from '../models/User.js'
import { Op } from 'sequelize'


export const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: {
        [Op.or]: [
          { senderId: req.userId },
          { receiverId: req.userId }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'phone'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'phone'] }
      ],
      order: [['createdAt', 'DESC']]
    })

    res.status(200).json({ transactions })

  } catch (error) {
    console.log('get transactions error:', error)
    res.status(500).json({ message: 'something went wrong' })
  }
}