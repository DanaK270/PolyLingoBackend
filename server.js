const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
// const path = require('path')

// PORT Configuration
const PORT = process.env.PORT || 4000

// Initialize Express
const app = express()

// app.use('/images', express.static(path.join(__dirname, '/public/images')))

// configure database
const db = require('./config/db')

// Middleware to parse JSON
app.use(express.json())

// Import Routes
const AuthRouter = require('./routes/AuthRouter')
const exerciseRoutes = require('./routes/exercise')

// CORS Configuration
app.use(cors())

// Mount Routes (after CORS)
app.use('/auth', AuthRouter)
app.use('/exercise', exerciseRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`)
})
