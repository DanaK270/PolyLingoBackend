const express = require('express')
const mongoose = require('mongoose')
const Discussion = require('./models/Discussion')

const logger = require('morgan')

const cors = require('cors')

const expressLayouts = require('express-ejs-layouts')

const userNoteRoutes = require('./routes/userNote')

const translation = require('./routes/translation')

require('dotenv').config()

// const path = require('path')
const { Reply } = require('./models/Reply') // Adjust the path if necessary

const PORT = process.env.PORT || 4000

const app = express()

// app.use('/images', express.static(path.join(__dirname, '/public/images')))
app.use(express.urlencoded({ extended: true }))

const db = require('./config/db')
app.get('/', function (req, res) {})
app.set('view engine', 'ejs')

app.get('/discussions', async (req, res) => {
  try {
    const discussions = await Discussion.find().populate('issues') // populate issues if needed
    res.json(discussions)
  } catch (err) {
    console.error('Error fetching discussions:', err)
    res.status(500).json({ error: 'Failed to fetch discussions' })
  }
})

// configure database
const { Issue } = require('./models/Issue')

app.use(cors())
app.use(express.json())

app.use('/userNote', userNoteRoutes)

app.use(express.urlencoded({ extended: false }))
app.use(logger('dev'))

const AuthRouter = require('./routes/AuthRouter')

app.use('/translate', translation)

const languageRouter = require('./routes/language')
const issueRouter = require('./routes/issue')
const exerciseRoutes = require('./routes/exercise')
const userProgressRouter = require('./routes/userProgress')

app.use(cors())

// CORS Configuration
// app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(expressLayouts)
app.use('/language', languageRouter)

app.use('/auth', AuthRouter)
app.use('/exercise', exerciseRoutes)
app.use('/issues', issueRouter)
app.use('/userProgress', userProgressRouter)

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`)
})
