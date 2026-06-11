import sequelize from '../config/db.js'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import { createOrder, generateSignature, generatePaymentId } from '../utils/mockGateway.js'
import bcrypt from 'bcryptjs'

export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'enter a valid amount' })
    }

    const order = createOrder(amount)

    await Transaction.create({
      type: 'DEPOSIT',
      status: 'PENDING',
      amount: amount,
      receiverId: req.userId,
      gatewayOrderId: order.id,
    })

    res.status(201).json({
      message: 'order created',
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    })

  } catch (error) {
    console.log('create order error:', error)
    res.status(500).json({ message: 'something went wrong' })
  }
}

export const mockConfirmPayment = async (req, res) => {
  try {
    const { order_id } = req.body

    if (!order_id) {
      return res.status(400).json({ message: 'order id required' })
    }

    const payment_id = generatePaymentId()
    const signature = generateSignature(order_id, payment_id)

    res.status(200).json({
      order_id,
      payment_id,
      signature,
    })

  } catch (error) {
    console.log('mock confirm error:', error)
    res.status(500).json({ message: 'something went wrong' })
  }
}

export const verifyPayment = async (req, res) => {
  const dbTransaction = await sequelize.transaction()

  try {
    const { order_id, payment_id, signature, passcode } = req.body

    if (!order_id || !payment_id || !signature || !passcode) {
      await dbTransaction.rollback()
      return res.status(400).json({ message: 'missing payment details or passcode' })
    }

    const user = await User.findByPk(req.userId, { 
      transaction: dbTransaction,
      lock: dbTransaction.LOCK.UPDATE 
    })

    const isPasscodeValid = await bcrypt.compare(passcode.toString(), user.passcode)
    
    if (!isPasscodeValid) {
      await dbTransaction.rollback()
      return res.status(400).json({ message: 'incorrect passcode' })
    }

    const txn = await Transaction.findOne({
      where: { gatewayOrderId: order_id, status: 'PENDING' },
      transaction: dbTransaction,
    })

    if (!txn) {
      await dbTransaction.rollback()
      return res.status(404).json({ message: 'transaction not found' })
    }

    const expectedSignature = generateSignature(order_id, payment_id)

    if (expectedSignature !== signature) {
      txn.status = 'FAILED'
      await txn.save({ transaction: dbTransaction })
      await dbTransaction.commit()

      return res.status(400).json({ message: 'payment verification failed' })
    }

    txn.status = 'SUCCESS'
    txn.gatewayPaymentId = payment_id
    await txn.save({ transaction: dbTransaction })

    user.balance = parseFloat(user.balance) + parseFloat(txn.amount)
    await user.save({ transaction: dbTransaction })

    await dbTransaction.commit()

    res.status(200).json({
      message: 'payment successful',
      newBalance: user.balance,
    })

  } catch (error) {
    await dbTransaction.rollback()
    console.log('verify payment error:', error)
    res.status(500).json({ message: 'something went wrong' })
  }
}

export const transferMoney = async (req, res) => {
  const dbTransaction = await sequelize.transaction()

  try {
    const { phone, amount, passcode } = req.body

    if (!phone || !amount || amount <= 0 || !passcode) {
      await dbTransaction.rollback()
      return res.status(400).json({ message: 'phone, valid amount, and passcode required' })
    }

    const sender = await User.findByPk(req.userId, { 
      transaction: dbTransaction,
      lock: dbTransaction.LOCK.UPDATE 
    })
    
    const isPasscodeValid = await bcrypt.compare(passcode.toString(), sender.passcode)
    if (!isPasscodeValid) {
      await dbTransaction.rollback()
      return res.status(400).json({ message: 'incorrect passcode' })
    }

    const receiver = await User.findOne({
      where: { phone },
      transaction: dbTransaction,
      lock: dbTransaction.LOCK.UPDATE 
    })

    if (!receiver) {
      await dbTransaction.rollback()
      return res.status(404).json({ message: 'recipient not found' })
    }

    if (receiver.id === sender.id) {
      await dbTransaction.rollback()
      return res.status(400).json({ message: 'cannot send money to yourself' })
    }

    if (parseFloat(sender.balance) < parseFloat(amount)) {
      await Transaction.create({
        type: 'P2P_TRANSFER',
        status: 'FAILED',
        amount: amount,
        senderId: sender.id,
        receiverId: receiver.id,
      }, { transaction: dbTransaction })

      await dbTransaction.commit()
      return res.status(400).json({ message: 'insufficient balance' })
    }

    sender.balance = parseFloat(sender.balance) - parseFloat(amount)
    receiver.balance = parseFloat(receiver.balance) + parseFloat(amount)

    await sender.save({ transaction: dbTransaction })
    await receiver.save({ transaction: dbTransaction })

    await Transaction.create({
      type: 'P2P_TRANSFER',
      status: 'SUCCESS',
      amount: amount,
      senderId: sender.id,
      receiverId: receiver.id,
    }, { transaction: dbTransaction })

    await dbTransaction.commit()

    res.status(200).json({
      message: 'money sent successfully',
      newBalance: sender.balance,
    })

  } catch (error) {
    await dbTransaction.rollback()
    console.log('transfer money error:', error)
    res.status(500).json({ message: 'something went wrong' })
  }
}