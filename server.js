const express = require('express')
const mongoose = require('mongoose')


const logger = require('morgan');

const cors = require('cors')

const expressLayouts = require('express-ejs-layouts')



const translation = require('./routes/translation');


require('dotenv').config()

const { Reply } = require('./models/Reply');  



const PORT = process.env.PORT || 4000


const app = express()

app.use(express.urlencoded({ extended: true }));
const db = require('./config/db')
app.get('/', function (req, res) {})
app.set('view engine', 'ejs')




const { Issue } = require('./models/Issue');

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
const issueRouter = require('./routes/issue')



const languageRouter=require("./routes/language")

const AuthRouter = require('./routes/AuthRouter')

app.use('/translate', translation);

app.use(cors())


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(expressLayouts)
app.use("/language",languageRouter)


app.use('/auth', AuthRouter)
app.use('/issues', issueRouter)


app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`)
})
