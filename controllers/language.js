const Language = require('../models/Language')
const Lesson = require('../models/Lesson')
const Discussion = require('../models/Discussion')

const cloudinary = require('cloudinary').v2
const mongoose = require('mongoose')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
console.log(process.env.CLOUDINARY_CLOUD_NAME)
const languageController = {
  createlanguage: async (req, res) => {
    const { languagename, difficulties, description, fields } = req.body

    try {
      const lessonIds = []

      for (const lesson of fields) {
        const videoUrls = []

        if (Array.isArray(lesson.video)) {
          console.log('here...')
          console.log('cloud_name')
          for (const videoPath of lesson.video) {
            const videoUploadResult = await cloudinary.uploader.upload(
              videoPath,
              {
                resource_type: 'video'
              }
            )
            console.log('videoUploadResult', videoUploadResult)
            videoUrls.push({
              url: videoUploadResult.secure_url,
              public_id: videoUploadResult.public_id
            })
          }
        }

        console.log('videoUrls', videoUrls)

        // Create a new lesson document with multiple videos
        const newLesson = new Lesson({
          name: lesson.name,
          description: lesson.description,
          video: videoUrls // Store array of uploaded video URLs
        })

        const savedLesson = await newLesson.save()
        lessonIds.push(savedLesson._id)

        // Create a new discussion for each lesson
        const newDiscussion = new Discussion({
          lessonId: savedLesson._id,
          issues: [] // Initially empty; can be populated with issues later
        })

        await newDiscussion.save()
      }

      const language = new Language({
        languagename,
        difficulties,
        description,
        fields: lessonIds // Reference the created lessons
      })

      await language.save()
      res
        .status(201)
        .send({ message: 'Language created successfully', language })
    } catch (err) {
      res.status(400).send({ message: 'Error creating language', error: err })
    }
  },

  getlanguage: async (req, res) => {
    try {
      const languages = await Language.find().populate('fields') // Populate fields with lesson data
      res.send(languages)
    } catch (err) {
      res
        .status(500)
        .send({ message: 'Error retrieving languages', error: err.message })
    }
  },

  // getlanguageById: async (req, res) => {
  //   const id = req.params.id;
  //   try {
  //     // const language = await Language.findById(id).populate('fields');
  //     const language = await Language.findById(id).populate({
  //       path: 'fields',
  //       populate: { path: 'discussion' }
  //     });
  //     // Populate fields with lesson data
  //     if (!language) {
  //       return res.status(404).send({ message: "Language not found" });
  //     }
  //     res.json(language);
  //   } catch (err) {
  //     res.status(500).send({ message: "Error retrieving language", error: err.message });
  //   }
  // },

  getlanguageById: async (req, res) => {
    const id = req.params.id
    try {
      const language = await Language.findById(id).populate({
        path: 'fields', // Populate the fields array with Lesson documents
        populate: {
          path: 'discussion', // Populate the discussion field in each Lesson
          model: 'Discussion' // Make sure to reference the correct model
        }
      })

      if (!language) {
        return res.status(404).send({ message: 'Language not found' })
      }

      res.json(language)
    } catch (err) {
      res
        .status(500)
        .send({ message: 'Error retrieving language', error: err.message })
    }
  },

  getLessonById: async (req, res) => {
    const lessonId = req.params.lessonId // Get the lesson ID from the request params
    try {
      // Find the lesson by ID and populate the associated discussion field
      const lesson = await Lesson.findById(lessonId).populate('discussion') // Assuming 'discussion' is a reference in the Lesson schema

      if (!lesson) {
        return res.status(404).send({ message: 'Lesson not found' })
      }

      res.json(lesson) // Return the lesson details
    } catch (err) {
      res
        .status(500)
        .send({ message: 'Error retrieving lesson', error: err.message })
    }
  },

  updatelanguage: async (req, res) => {
    const id = req.params.id
    const {
      languagename,
      difficulties,
      description,
      fields // This should be an array of lesson objects
    } = req.body

    try {
      const lessonIds = []
      // Upload each lesson video to Cloudinary and save lessons
      for (const lesson of fields) {
       

        const newLesson = new Lesson({
          name: lesson.name,
          description: lesson.description,
        
        })

        const savedLesson = await newLesson.save()
        lessonIds.push(savedLesson._id) // Store the lesson ID
      }

      const language = await Language.findByIdAndUpdate(
        id,
        {
          languagename,
          difficulties,
          description,
          fields: lessonIds // Update fields with new lesson IDs
        },
        { new: true, runValidators: true }
      )

      if (!language) {
        return res.status(404).send({ message: 'Language not found' })
      }
      res.send({ message: 'Language updated successfully', language })
    } catch (err) {
      res
        .status(400)
        .send({ message: 'Error updating language', error: err.message })
    }
  },

  deletelanguage: async (req, res) => {
    const id = req.params.id
    try {
      // Find the language and get its associated lessons
      // const language = await Language.findById(id).populate("fields");

      const language = await Language.findById(id).populate({
        path: 'fields',
        populate: { path: 'discussion' }
      })

      if (!language) {
        return res.status(404).send({ message: 'Language not found' })
      }

      // Log the populated fields to check the structure
      console.log('Populated Fields (Lessons):', language.fields)

      // Extract the lesson IDs from the fields array
      const lessonIds = language.fields.map((lesson) => lesson._id)
      console.log('Lesson IDs to delete:', lessonIds) // Check the lesson IDs

      // If there are lesson IDs to delete, proceed with the deletion
      if (lessonIds.length > 0) {
        // Delete all lessons associated with this language
        const deleteLessonsResult = await Lesson.deleteMany({
          _id: { $in: lessonIds }
        })
        console.log(deleteLessonsResult) // Log the delete result
      } else {
        return res.status(500).send({ message: 'No lessons found to delete.' })
      }

      // Now delete the language
      await Language.findByIdAndDelete(id)

      res.send({
        message: 'Language and associated lessons deleted successfully'
      })
    } catch (err) {
      console.error(err) // Log the error for debugging purposes
      res
        .status(500)
        .send({ message: 'Error deleting language', error: err.message })
    }
  },

  deletelesson: async (req, res) => {
    let lessonId = req.params.lessonId

    // Convert the lessonId to ObjectId (if it's not already)
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).send({ message: 'Invalid lesson ID' })
    }

    try {
      // Delete the lesson from the Lesson collection
      const lesson = await Lesson.findByIdAndDelete(lessonId)
      if (!lesson) {
        return res.status(404).send({ message: 'Lesson not found' })
      }

      // Remove the lesson reference from the fields array in all languages
      const updateLanguage = await Language.updateMany(
        { fields: lessonId }, // Find languages that have this lesson in the fields array
        { $pull: { fields: lessonId } } // Pull (remove) the lesson reference from the fields array
      )

      // Check if any languages were updated
      if (updateLanguage.modifiedCount === 0) {
        return res
          .status(400)
          .send({ message: 'Lesson not found in any language fields' })
      }

      res.send({
        message: 'Lesson deleted and removed from language fields successfully'
      })
    } catch (err) {
      console.error(err) // Log the error for debugging purposes
      res
        .status(500)
        .send({ message: 'Error deleting lesson', error: err.message })
    }
  }
}

module.exports = languageController