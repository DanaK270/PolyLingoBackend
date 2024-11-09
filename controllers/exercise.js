const Exercise = require('../models/Exercise')

// Create a new exercise
exports.createExercise = async (req, res) => {
  try {
    const { lessonId, question, correctAnswer, options, hints } = req.body
    const exercise = new Exercise({
      lessonId,
      question,
      correctAnswer,
      options,
      hints
    })
    await exercise.save()
    res.status(201).json({ success: true, data: exercise })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get all exercises
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find()
    res.status(200).json({ success: true, data: exercises })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get a single exercise by ID
exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id)
    if (!exercise) {
      return res
        .status(404)
        .json({ success: false, error: 'Exercise not found' })
    }
    res.status(200).json({ success: true, data: exercise })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get all exercises for a specific lesson
exports.getExercisesByLessonId = async (req, res) => {
  try {
    const { lessonId } = req.params
    const exercises = await Exercise.find({ lessonId })

    if (exercises.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No exercises found for this lesson' })
    }

    res.status(200).json({ success: true, data: exercises })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Update an exercise by ID
exports.updateExercise = async (req, res) => {
  try {
    const { lessonId, question, correctAnswer, options, hints } = req.body
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, {
      lessonId,
      question,
      correctAnswer,
      options,
      hints
    })

    if (!exercise) {
      return res
        .status(404)
        .json({ success: false, error: 'Exercise not found' })
    }

    res.status(200).json({ success: true, data: exercise })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Delete an exercise by ID
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id)
    if (!exercise) {
      return res
        .status(404)
        .json({ success: false, error: 'Exercise not found' })
    }
    res
      .status(200)
      .json({ success: true, message: 'Exercise deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
