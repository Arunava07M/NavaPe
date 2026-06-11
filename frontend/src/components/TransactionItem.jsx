import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

const TransactionItem = ({ txn }) => {
  const { user } = useContext(AuthContext)

  const isDeposit = txn.type === 'DEPOSIT'
  const isSender = txn.senderId === user?.id

  const isCredit = isDeposit || !isSender

  let label = ''
  if (isDeposit) {
    label = 'Added Money'
  } else if (isSender) {
    label = `Sent to ${txn.receiver?.name || 'Unknown'}`
  } else {
    label = `Received from ${txn.sender?.name || 'Unknown'}`
  }

  const date = new Date(txn.createdAt).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-400">{date} &middot; {txn.status}</p>
      </div>
      <p className={`text-sm font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
        {isCredit ? '+' : '-'}₹{txn.amount}
      </p>
    </div>
  )
}

export default TransactionItem