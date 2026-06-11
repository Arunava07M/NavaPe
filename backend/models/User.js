import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  passcode: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00, 
  },
})

export default User