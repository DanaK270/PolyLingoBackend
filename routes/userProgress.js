const express = require('express')
const router = express.Router()
const userProgressController = require('../controllers/userProgress')
const middleware = require('../middleware/index')

router.get(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  userProgressController.getUserProgress
)

router.get(
  '/:language_id',
  middleware.stripToken,
  middleware.verifyToken,
  userProgressController.getUserProgressByLanguage
)

router.get(
  '/id/:progressId',
  middleware.stripToken,
  middleware.verifyToken,
  userProgressController.getUserProgressById
)

router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  userProgressController.createUserProgress
)
router.delete('/:id', userProgressController.deleteUserProgress)
router.put('/:id', userProgressController.updateUserProgress)
router.put('/stats/:id/', userProgressController.updateUserProgressStats)

module.exports = router
