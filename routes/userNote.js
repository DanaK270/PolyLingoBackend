const express = require('express')
const router = express.Router()
const noteController = require('../controllers/userNote')

router.post('/notes', noteController.createUserNote)
router.get('/notes/user/:userId', noteController.getUserNotesByUserId)
router.get('/notes/:id', noteController.getUserNoteById)
router.put('/notes/:id', noteController.updateUserNote)
router.delete('/notes/:id', noteController.deleteUserNote)

module.exports = router
