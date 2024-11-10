const express = require('express');
const router = express.Router();
const controller = require('../controllers/userNote');

// Route to create a new user note
router.post('/notes', controller.createUserNote);

// Route to get all notes for a specific user
router.get('/notes/user/:userId', controller.getUserNotesByUserId);

// Route to get a specific note by ID
router.get('/notes/:id', controller.getUserNoteById);

// Route to update a note by ID
router.put('/notes/:id', controller.updateUserNote);

// Route to delete a note by ID
router.delete('/notes/:id', controller.deleteUserNote);

module.exports = router;
