import { useState } from 'react'
import api from '../api/axios.js'

const CheckoutModal = ({ orderId, amount, onClose, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [passcode, setPasscode] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const handlePay = async () => {
    if (!passcode) {
      setError('please enter your passcode')
      return
    }

    setProcessing(true)
    setError('')

    try {
      const confirmRes = await api.post('/wallet/mock-confirm', {
        order_id: orderId,
      })

      const { order_id, payment_id, signature } = confirmRes.data

      const verifyRes = await api.post('/wallet/verify-payment', {
        order_id,
        payment_id,
        signature,
        passcode,
      })

      setTimeout(() => {
        setProcessing(false)
        onSuccess(verifyRes.data.newBalance)
      }, 1000)

    } catch (err) {
      setProcessing(false)
      setError(err.response?.data?.message || 'payment failed')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">NavaPe Checkout</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            &times;
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-1">Amount to pay</p>
        <p className="text-2xl font-semibold text-gray-900 mb-4">₹{amount}</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-2 rounded mb-3 border border-red-100">
            {error}
          </div>
        )}

        <p className="text-sm text-gray-600 mb-2">Choose payment method (test mode)</p>

        <div className="space-y-2 mb-4">
          {['upi', 'card', 'netbanking'].map((method) => (
            <label
              key={method}
              className={`flex items-center border rounded px-3 py-2 cursor-pointer text-sm ${
                selectedMethod === method ? 'border-gray-900' : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="method"
                value={method}
                checked={selectedMethod === method}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="mr-2"
              />
              {method === 'upi' && 'UPI'}
              {method === 'card' && 'Card'}
              {method === 'netbanking' && 'Net Banking'}
            </label>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Enter NavaPe Passcode</label>
          <input
            type="password"
            maxLength="4"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500 text-center tracking-[0.5em]"
            placeholder="••••"
          />
        </div>

        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full bg-gray-900 text-white py-2 rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {processing ? 'Processing...' : `Pay ₹${amount}`}
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">
          This is a test payment simulation. No real money is involved.
        </p>
      </div>
    </div>
  )
}

export default CheckoutModal