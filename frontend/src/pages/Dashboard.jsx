import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import api from '../api/axios.js'
import TransactionItem from '../components/TransactionItem.jsx'

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions')
        setTransactions(res.data.transactions)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <img src="/navape-logo.svg" alt="logo" className="w-8 h-8" />
            <h1 className="text-xl font-semibold text-gray-900">NavaPe</h1>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Logout
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
          <p className="text-sm text-gray-500">Welcome,</p>
          <h2 className="text-lg font-medium text-gray-900">{user?.name}</h2>
          <p className="text-3xl font-semibold text-gray-900 mt-4">
            ₹{user?.balance}
          </p>
          <p className="text-sm text-gray-500 mb-4">Wallet Balance</p>

          <div className="flex gap-3">
            <Link
              to="/add-money"
              className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded hover:bg-gray-800"
            >
              + Add Money
            </Link>
            <Link
              to="/transfer"
              className="border border-gray-900 text-gray-900 text-sm font-medium px-4 py-2 rounded hover:bg-gray-50"
            >
              Send Money
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Recent Transactions</h3>

          {loading && <p className="text-sm text-gray-400">Loading...</p>}

          {!loading && transactions.length === 0 && (
            <p className="text-sm text-gray-400">No transactions yet</p>
          )}

          {!loading && transactions.map((txn) => (
            <TransactionItem key={txn.id} txn={txn} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard