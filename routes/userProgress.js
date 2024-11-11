const express = require('express')
const router = express.Router()
const userProgressController = require('../controllers/userProgress')

router.get('/', userProgressController.GetUserProgress)
router.post('/', userProgressController.createUserProgress)