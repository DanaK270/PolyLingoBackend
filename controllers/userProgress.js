const UserProgress = require('../models/UserProgress')

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

const GetUserProgress = async (req, res) => {
  try {
    const userProg = await UserProgress.find({ user_id: res.locals.payload.id })
      .populate('user_id')
      .populate('languages_id')
      .populate('completedLessons')

    res.status(200).json({ success: true, data: userProg })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// // Update a UserProgress record by ID
// const updateUserProgress = async (req, res) => {
//   try {
//     const userProgress = await UserProgress.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     })
//     if (!userProgress) {
//       return res.status(404).json({ success: false, message: 'UserProgress not found' })
//     }
//     res.status(200).json({ success: true, data: userProgress })
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message })
//   }
// }

// // Delete a UserProgress record by ID
// const deleteUserProgress = async (req, res) => {
//   try {
//     const userProgress = await UserProgress.findByIdAndDelete(req.params.id)
//     if (!userProgress) {
//       return res.status(404).json({ success: false, message: 'UserProgress not found' })
//     }
//     res.status(200).json({ success: true, message: 'UserProgress deleted successfully' })
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message })
//   }
// }

// // Update completedLessons, totalPoints, or streak
// const updateUserProgressStats = async (req, res) => {
//   try {
//     const { id } = req.params
//     const { completedLessonId, points, streak } = req.body

//     const userProgress = await UserProgress.findById(id)
//     if (!userProgress) {
//       return res.status(404).json({ success: false, message: 'UserProgress not found' })
//     }

//     if (completedLessonId) {
//       userProgress.completedLessons.push(completedLessonId)
//     }
//     if (points) {
//       userProgress.totalPoints += points
//     }
//     if (streak) {
//       userProgress.streak = streak
//     }

//     await userProgress.save()
//     res.status(200).json({ success: true, data: userProgress })
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message })
//   }
// }

module.exports = {
  createUserProgress,
  GetUserProgress
  // updateUserProgress,
  // deleteUserProgress,
  // updateUserProgressStats
}
