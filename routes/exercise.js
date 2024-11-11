const express = require('express')
const router = express.Router()
const exerciseController = require('../controllers/exercise')

router.post('/', exerciseController.createExercise)
router.get('/', exerciseController.getAllExercises)
router.get('/:id', exerciseController.getExerciseById)
router.get('/lesson/:lessonId', exerciseController.getExercisesByLessonId)
router.put('/:id', exerciseController.updateExercise)
router.delete('/:id', exerciseController.deleteExercise)

module.exports = router
