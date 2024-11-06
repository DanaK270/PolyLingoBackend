const express = require('express')
const mongoose = require('mongoose')
// const cors = require('cors')
require('dotenv').config()
// const path = require('path')

// PORT Configuration
const PORT = process.env.PORT || 4000

// Initialize Express
const app = express()

// app.use(cors())
// app.use('/images', express.static(path.join(__dirname, '/public/images')))

// const db = require('./config/db')

// Import Routes

// CORS Configuration
// app.use(cors())

// Mount Routes (after CORS)

// Start server
app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`)
})
