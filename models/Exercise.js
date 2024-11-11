const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  // type: {
  //   type: String,
  //   enum: ['MCQ',],
  //   required: true
  // },
  question: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  options: [String],
  hints: String
})

module.exports = mongoose.model('Exercise', exerciseSchema)
