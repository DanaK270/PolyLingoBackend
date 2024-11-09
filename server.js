const express = require('express')
const mongoose = require('mongoose')

const logger = require('morgan');

const cors = require('cors')
require('dotenv').config()
// const path = require('path')
const { Reply } = require('./models/Reply');  // Adjust the path if necessary


// PORT Configuration
const PORT = process.env.PORT || 4000

// Initialize Express
const app = express()

// app.use('/images', express.static(path.join(__dirname, '/public/images')))

// configure database
const db = require('./config/db')
const { Issue } = require('./models/Issue');

// Middleware to parse JSON
// CORS Configuration
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
const issueRouter = require('./routes/issue')


// Import Routes
const AuthRouter = require('./routes/AuthRouter')


app.use(cors())


// Mount Routes (after CORS)
app.use('/auth', AuthRouter)
app.use('/issues', issueRouter)

// Start server
app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`)
})
