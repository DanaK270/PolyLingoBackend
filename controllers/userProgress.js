const UserProgress = require('../models/UserProgress')
const Lesson = require('../models/Lesson')

// create a new userc progress // NOTE: this should be called whenevr the user starts to learn a new language
const createUserProgress = async (req, res) => {
  try {
    console.log('user', res.locals.payload.id)
    const userProgress = new UserProgress({
      ...req.body,
      user_id: res.locals.payload.id //user = logged in user
    })
    await userProgress.save()
    res.status(201).json({ success: true, data: userProgress })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// get all the progresses of the logged in user
const GetUserProgress = async (req, res) => {
  try {
    // const lessons = await Lesson.find({
    //   _id: { $in: ['6731cd00682c379f21e64e62'] }
    // })
    // console.log('Lessons found:', lessons)

    const userProg = await UserProgress.find({ user_id: res.locals.payload.id })
      .populate('user_id')
      .populate('language_id')
      .populate('completedLessons')

    res.status(200).json({ success: true, data: userProg })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// get a specific user progress
const GetUserProgressById = async (req, res) => {
  try {
    const { language_id } = req.params // Get language_id from query parameters
    const user_id = res.locals.payload.id // Assume `req.user.id` is set for the logged-in user

    if (!language_id) {
      return res
        .status(400)
        .json({ success: false, message: 'Language ID is required' })
    }

    const userProg = await UserProgress.findOne({
      user_id,
      language_id: language_id
    })
      .populate('user_id')
      .populate('language_id')
      .populate('completedLessons')

    if (!userProg) {
      return res.status(404).json({
        success: false,
        message: 'User progress not found for this language'
      })
    }

    res.status(200).json({ success: true, data: userProg })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// update a UserProgress by ID
const updateUserProgress = async (req, res) => {
  try {
    const userProgress = await UserProgress.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    if (!userProgress) {
      return res
        .status(404)
        .json({ success: false, message: 'UserProgress not found' })
    }
    res.status(200).json({ success: true, data: userProgress })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// // Delete a UserProgress record by ID
const deleteUserProgress = async (req, res) => {
  try {
    const userProgress = await UserProgress.findByIdAndDelete(req.params.id)
    if (!userProgress) {
      return res
        .status(404)
        .json({ success: false, message: 'UserProgress not found' })
    }
    res
      .status(200)
      .json({ success: true, message: 'UserProgress deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update completedLessons, totalPoints, or streak
const updateUserProgressStats = async (req, res) => {
  try {
    const { id } = req.params
    const { completedLessonId, points, streak } = req.body

    const userProgress = await UserProgress.findById(id)
    if (!userProgress) {
      return res
        .status(404)
        .json({ success: false, message: 'UserProgress not found' })
    }

    if (completedLessonId) {
      userProgress.completedLessons.push(completedLessonId)
    }
    if (points) {
      userProgress.totalPoints += points
    }
    if (streak) {
      userProgress.streak = streak
    }

    await userProgress.save()
    res.status(200).json({ success: true, data: userProgress })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

module.exports = {
  createUserProgress,
  GetUserProgress,
  GetUserProgressById,
  updateUserProgress,
  deleteUserProgress,
  updateUserProgressStats
}
