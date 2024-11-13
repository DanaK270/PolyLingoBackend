const mongoose = require('mongoose')
const { Issue } = require('./Issue')
const { Reply } = require('./Reply')
const { User } = require('./User')
const { Language } = require('./Language')

module.exports = {
  Issue,
  Reply,
  User,
  Language
}
