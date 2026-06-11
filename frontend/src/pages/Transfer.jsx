import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios.js'
import { AuthContext } from '../context/AuthContext.jsx'

const Transfer = () => {
  const [phone, setPhone] = useState('')
  const [recipient, setRecipient] = useState(null)
  const [amount, setAmount] = useState('')
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searching, setSearching] = useState(false)
  const [sending, setSending] = useState(false)
  const { refreshUser } = useContext(AuthContext)

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setRecipient(null)

    if (!phone) {
      setError('enter a phone number')
      return
    }

    setSearching(true)

    try {
      const res = await api.get(`/users/lookup?phone=${phone}`)
      setRecipient(res.data.user)
    } catch (err) {
      setError(err.response?.data?.message || 'user not found')
    } finally {
      setSearching(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!amount || amount <= 0) {
      setError('enter a valid amount')
      return
    }

    if (!passcode) {
      setError('please enter your passcode')
      return
    }

    setSending(true)

    try {
      await api.post('/wallet/transfer', { phone, amount: Number(amount), passcode })

      setSuccess(`₹${amount} sent to ${recipient.name} successfully!`)
      await refreshUser() 

      setPhone('')
      setRecipient(null)
      setAmount('')
      setPasscode('')

    } catch (err) {
      setError(err.response?.data?.message || 'transfer failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-sm mx-auto">
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">
          &larr; Back to Dashboard
        </Link>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mt-4">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Send Money</h1>
          <p className="text-sm text-gray-500 mb-6">Transfer to another NavaPe user</p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-2 rounded mb-4 border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 text-sm p-3 rounded mb-4 border border-green-100">
              {success}
            </div>
          )}

          <form onSubmit={handleSearch} className="space-y-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Recipient Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  setRecipient(null) 
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                placeholder="9876543210"
              />
            </div>

            <button
              type="submit"
              disabled={searching}
              className="w-full border border-gray-900 text-gray-900 py-2 rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              {searching ? 'Searching...' : 'Find Recipient'}
            </button>
          </form>

          {recipient && (
            <div className="border-t border-gray-100 pt-4">
              <div className="bg-gray-50 rounded p-3 mb-4">
                <p className="text-xs text-gray-500">Sending to</p>
                <p className="text-sm font-medium text-gray-900">{recipient.name}</p>
                <p className="text-xs text-gray-500">{recipient.phone}</p>
              </div>

              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                    placeholder="100"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">NavaPe Passcode</label>
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
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gray-900 text-white py-2 rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  {sending ? 'Sending...' : `Send ₹${amount || '0'}`}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Transfer