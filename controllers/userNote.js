const UserNotes = require('../models/UserNote')

// Create a new user note
const createUserNote = async (req, res) => {
  try {
    const { userId, lessonId, content } = req.body

    const userNote = new UserNotes({
      userId,
      lessonId,
      content
    })

    await userNote.save()
    res.status(201).json({ message: 'Note created successfully', userNote })
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error })
  }
}

// specific note per user
const getUserNotesByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const userNotes = await UserNotes.find({ userId }).populate('lessonId')

    res.status(200).json(userNotes)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error })
  }
}


const getNotesByUserAndLesson = async (req, res) => {
  try {
    const { userId, lessonId } = req.params;

    if (!userId || !lessonId) {
      return res.status(400).json({ message: 'User ID and Lesson ID are required' });
    }

    // Fetch notes for the specified user and lesson
    const userNotes = await UserNotes.find({ userId, lessonId });

    if (!userNotes.length) {
      return res.status(404).json({ message: 'No notes found for this user and lesson' });
    }

    res.status(200).json(userNotes);
  } catch (error) {
    console.error('Error fetching notes:', error); // Log the full error
    res.status(500).json({ message: 'Failed to fetch notes', error: error.message || error });
  }
};


// getting user specified note
const getUserNoteById = async (req, res) => {
  try {
    const { id } = req.params
    const userNote = await UserNotes.findById(id).populate('lessonId')

    if (!userNote) {
      return res.status(404).json({ message: 'Note not found' })
    }

    res.status(200).json(userNote)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note', error })
  }
}

// Update a user note by ID
const updateUserNote = async (req, res) => {
  try {
    const { id } = req.params
    const { content } = req.body

    const updatedUserNote = await UserNotes.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    )

    if (!updatedUserNote) {
      return res.status(404).json({ message: 'Notes not found' })
    }

    res
      .status(200)
      .json({ message: 'Note updated successfully', updatedUserNote })
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error })
  }
}

// Delete a user note by ID
const deleteUserNote = async (req, res) => {
  try {
    const { id } = req.params

    const deletedUserNote = await UserNotes.findByIdAndDelete(id)

    if (!deletedUserNote) {
      return res.status(404).json({ message: 'User note not found' })
    }

    res.status(200).json({ message: 'User note deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user note', error })
  }
}

module.exports = {
  createUserNote,
  getUserNotesByUserId,
  getUserNoteById,
  updateUserNote,
  deleteUserNote,
  getNotesByUserAndLesson
}
