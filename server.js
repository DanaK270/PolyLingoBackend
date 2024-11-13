const express = require('express')
const mongoose = require('mongoose')
const Discussion = require('./models/Discussion')
const User = require('./models/User')

const logger = require('morgan')

const cors = require('cors')

const expressLayouts = require('express-ejs-layouts')

// const UserNotes = require('./models/UserNote')

// const translation = require('./routes/translation');

const userNoteRoutes = require('./routes/userNote')

const translation = require('./routes/translation')



// const issueRouter = require('./routes/issue')

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

app.get('/users/:userId', async (req, res) => {
  try {
    // Extract userId from request parameters
    const { userId } = req.params

    // Fetch user from database by userId
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Respond with user's name
    res.status(200).json({ name: user.name })
  } catch (error) {
    console.error('Error fetching user name:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.use('/userProgress', userProgressRouter)

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`)
})
