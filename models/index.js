const mongoose = require('mongoose');
const { Issue } = require('./Issue'); 
const { Reply } = require('./Reply'); 
const { User } = require('./User');
const { Language } = require('./Language')

// const Issue = mongoose.model('Issue', issueSchema); // Create the Issue model

module.exports = {
  Issue,
  Reply,
  User,
  Language
};
