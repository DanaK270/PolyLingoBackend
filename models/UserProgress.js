const mongoose = require('mongoose')

const userProgressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  language_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: true
  },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  totalPoints: { type: Number, default: 0 },
  streak: { type: Number, default: 0 }
})

const UserProgress = mongoose.model('UserProgress', userProgressSchema)
module.exports = UserProgress
