import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import User from './User.js'

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('DEPOSIT', 'P2P_TRANSFER'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'),
    defaultValue: 'PENDING',
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  gatewayOrderId: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  gatewayPaymentId: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
})


Transaction.belongsTo(User, { as: 'sender', foreignKey: 'senderId' })
Transaction.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' })

export default Transaction