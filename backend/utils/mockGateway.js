import crypto from 'crypto'

export const createOrder = (amount) => {
  const orderId = 'order_' + crypto.randomBytes(8).toString('hex')

  return {
    id: orderId,
    amount: amount,
    currency: 'INR',
  }
}


export const generateSignature = (orderId, paymentId) => {
  const secret = process.env.GATEWAY_SECRET

  const signature = crypto
    .createHmac('sha256', secret)
    .update(orderId + '|' + paymentId)
    .digest('hex')

  return signature
}


export const generatePaymentId = () => {
  return 'pay_' + crypto.randomBytes(8).toString('hex')
}