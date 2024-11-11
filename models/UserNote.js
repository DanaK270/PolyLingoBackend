const mongoose = require('mongoose')

const userNotesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' /*, required: true */
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
    /*required: true*/
  },
  content: { type: String /*, required: true */ },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('UserNotes', userNotesSchema)
