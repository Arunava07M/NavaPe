import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import sequelize from './config/db.js'
import User from './models/User.js'
import Transaction from './models/Transaction.js'
import authRoutes from './routes/authRoutes.js'
import walletRoutes from './routes/walletRoutes.js'
import userRoutes from './routes/userRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerDocument = require('./swagger.json');

dotenv.config()

const app = express()
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('NavaPe backend is running')
})

app.use('/api/auth', authRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/users', userRoutes)
app.use('/api/transactions', transactionRoutes)

const PORT = process.env.PORT || 8000

const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('database connected successfully')

    await sequelize.sync()
    console.log('models synced')

    //await sequelize.sync({ force: true })


    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`)
    })
  } catch (error) {
    console.log('unable to connect to database:', error)
  }
}

startServer()