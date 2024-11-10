const express = require('express')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')
// const cors = require('cors')
require('dotenv').config()
// const path = require('path')

// PORT Configuration
const PORT = process.env.PORT || 4000

// Initialize Express
const app = express()

// app.use(cors())
// app.use('/images', express.static(path.join(__dirname, '/public/images')))
app.use(express.urlencoded({ extended: true }));
const db = require('./config/db')
app.get('/', function (req, res) {})
app.set('view engine', 'ejs')

// const db = require('./config/db')
const languageRouter=require("./routes/language")
// Import Routes

// CORS Configuration
// app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(expressLayouts)
app.use("/language",languageRouter)
// Mount Routes (after CORS)

// Start server
app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`)
})
