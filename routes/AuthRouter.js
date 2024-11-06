const router = require('express').Router()
const controller = require('../controllers/AuthController')
const middleware = require('../middleware')

// Login route: Issues both access and refresh tokens
router.post('/login', controller.Login)

// Register route: Creates a new user
router.post('/register', controller.Register)

// Update password: Requires valid access token
router.put(
  '/update/:user_id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdatePassword
)

// Check session: Verifies access token validity
router.get(
  '/session',
  middleware.stripToken,
  middleware.verifyToken,
  controller.CheckSession
)

// Refresh token: Issues a new access token using a refresh token
router.post('/refresh-token', controller.RefreshToken) // Uses RefreshToken from controller

module.exports = router
