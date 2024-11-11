const express = require('express')
const router = express.Router()
const userProgressController = require('../controllers/userProgress')
const middleware = require('../middleware/index')

router.get(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  userProgressController.GetUserProgress
)
router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  userProgressController.createUserProgress
)

module.exports = router
