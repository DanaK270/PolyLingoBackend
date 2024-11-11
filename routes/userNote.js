const express = require('express')
const router = express.Router()
const userNote = require('../controllers/userNote')

router.post('/notes', userNote.createUserNote)
router.get('/notes/user/:userId', userNote.getUserNotesByUserId)
router.get('/notes/:id', userNote.getUserNoteById)
router.put('/notes/:id', userNote.updateUserNote)
router.delete('/notes/:id', userNote.deleteUserNote)

module.exports = router
