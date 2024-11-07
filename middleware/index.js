const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10
const APP_SECRET = process.env.APP_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret'

// Hash a password
const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    return hashedPassword
  } catch (error) {
    console.error('Error hashing password:', error)
    throw new Error('Hashing failed.')
  }
}

// Compare plain text with hashed password
const comparePassword = async (storedPassword, password) => {
  try {
    return await bcrypt.compare(password, storedPassword)
  } catch (error) {
    console.error('Error comparing passwords:', error)
    throw new Error('Password comparison failed.')
  }
}

// Create access token with 1-hour expiration
const createToken = (payload) => {
  try {
    return jwt.sign(payload, APP_SECRET, { expiresIn: '1h' })
  } catch (error) {
    console.error('Error creating token:', error)
    throw new Error('Token creation failed.')
  }
}

// Create refresh token with 7-day expiration
const createRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' })
  } catch (error) {
    console.error('Error creating refresh token:', error)
    throw new Error('Refresh token creation failed.')
  }
}

// Extract token from headers
const stripToken = (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]
    if (token) {
      res.locals.token = token
      return next()
    }
    res
      .status(401)
      .send({ status: 'Error', msg: 'Unauthorized: No token provided' })
  } catch (error) {
    console.error('Error stripping token:', error)
    res.status(401).send({ status: 'Error', msg: 'Strip Token Error' })
  }
}

// Verify token and decode payload
const verifyToken = (req, res, next) => {
  try {
    const payload = jwt.verify(res.locals.token, APP_SECRET)
    res.locals.payload = payload
    return next()
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(401).send({
      status: 'Error',
      msg:
        error.name === 'TokenExpiredError' ? 'Token Expired' : 'Invalid Token'
    })
  }
}

// Verify refresh token and issue new access token
const verifyRefreshToken = (req, res) => {
  const { refreshToken } = req.body
  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET)
    const newAccessToken = createToken({
      id: payload.id,
      email: payload.email,
      role: payload.role
    })
    res.send({ accessToken: newAccessToken })
  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(401).send({ status: 'Error', msg: 'Invalid Refresh Token' })
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  createToken,
  createRefreshToken,
  stripToken,
  verifyToken,
  verifyRefreshToken
}
