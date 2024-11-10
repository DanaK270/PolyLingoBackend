const express = require('express')
const router = express.Router()
const controller = require('../controllers/userNote')

router.post('/notes', controller.createUserNote)
router.get('/notes/user/:userId', controller.getUserNotesByUserId)
router.get('/notes/:id', controller.getUserNoteById)
router.put('/notes/:id', controller.updateUserNote)
router.delete('/notes/:id', controller.deleteUserNote)

module.exports = router
