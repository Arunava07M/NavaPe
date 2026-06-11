import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios.js'
import { AuthContext } from '../context/AuthContext.jsx'
import CheckoutModal from '../components/CheckoutModal.jsx'

const AddMoney = () => {
  const [amount, setAmount] = useState('')
  const [orderId, setOrderId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { refreshUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleCreateOrder = async (e) => {
    e.preventDefault()
    setError('')

    if (!amount || amount <= 0) {
      setError('enter a valid amount')
      return
    }

    try {
      const res = await api.post('/wallet/create-order', { amount: Number(amount) })
      setOrderId(res.data.order_id)
    } catch (err) {
      setError(err.response?.data?.message || 'something went wrong')
    }
  }

  const handlePaymentSuccess = async () => {
    await refreshUser() 
    setOrderId(null)
    setSuccess(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-sm mx-auto">
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">
          &larr; Back to Dashboard
        </Link>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mt-4">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Add Money</h1>
          <p className="text-sm text-gray-500 mb-6">Load funds into your NavaPe wallet</p>

          {success && (
            <div className="bg-green-50 text-green-700 text-sm p-3 rounded mb-4 border border-green-100">
              Payment successful! Your wallet has been updated.
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-2 rounded mb-4 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                placeholder="500"
                min="1"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2 rounded text-sm font-medium hover:bg-gray-800"
            >
              Proceed to Pay
            </button>
          </form>
        </div>
      </div>

      {orderId && (
        <CheckoutModal
          orderId={orderId}
          amount={amount}
          onClose={() => setOrderId(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}

export default AddMoney