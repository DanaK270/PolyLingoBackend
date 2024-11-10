const Language = require("../models/Language");
const Lesson = require("../models/Lesson"); // Import Lesson model
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const languageController = {
  createlanguage: async (req, res) => {
    const {
      languagename,
      difficulties,
      description,
      fields, 
    } = req.body;
    
    try {
      const lessonIds = [];
     
      for (const lesson of fields) {
        const videoUploadResult = await cloudinary.uploader.upload(lesson.video, {
          resource_type: "video",
        });
        
        const newLesson = new Lesson({
          name: lesson.name,
          description: lesson.description,
          video: [
            {
              url: videoUploadResult.secure_url,
              public_id: videoUploadResult.public_id, 
            },
          ],
        });

        const savedLesson = await newLesson.save();
        lessonIds.push(savedLesson._id); 
      }

      const language = new Language({
        languagename,
        difficulties,
        description,
        fields: lessonIds, // Reference the created lessons
      });
      
      await language.save();
      res.status(201).send({ message: "Language created successfully", language });
    } catch (err) {
      res.status(400).send({ message: "Error creating language", error: err.message });
    }
  },

  getlanguage: async (req, res) => {
    try {
      const languages = await Language.find().populate('fields'); // Populate fields with lesson data
      res.send(languages);
    } catch (err) {
      res.status(500).send({ message: "Error retrieving languages", error: err.message });
    }
  },

  getlanguageById: async (req, res) => {
    const id = req.params.id;
    try {
      const language = await Language.findById(id).populate('fields'); // Populate fields with lesson data
      if (!language) {
        return res.status(404).send({ message: "Language not found" });
      }
      res.json(language);
    } catch (err) {
      res.status(500).send({ message: "Error retrieving language", error: err.message });
    }
  },

  updatelanguage: async (req, res) => {
    const id = req.params.id;
    const {
      languagename,
      difficulties,
      description,
      fields, // This should be an array of lesson objects
    } = req.body;
    
    try {
      const lessonIds = [];
      // Upload each lesson video to Cloudinary and save lessons
      for (const lesson of fields) {
        const videoUploadResult = await cloudinary.uploader.upload(lesson.video, {
          resource_type: "video",
        });
        
        const newLesson = new Lesson({
          name: lesson.name,
          description: lesson.description,
          video: [
            {
              url: videoUploadResult.secure_url,
              public_id: videoUploadResult.public_id, // Store additional metadata if needed
            },
          ],
        });

        const savedLesson = await newLesson.save();
        lessonIds.push(savedLesson._id); // Store the lesson ID
      }

      const language = await Language.findByIdAndUpdate(
        id,
        {
          languagename,
          difficulties,
          description,
          fields: lessonIds, // Update fields with new lesson IDs
        },
        { new: true, runValidators: true }
      );
      
      if (!language) {
        return res.status(404).send({ message: "Language not found" });
      }
      res.send({ message: "Language updated successfully", language });
    } catch (err) {
      res.status(400).send({ message: "Error updating language", error: err.message });
    }
  },

  deletelanguage: async (req, res) => {
    const id = req.params.id;
    try {
      const deletedLanguage = await Language.findByIdAndDelete(id);
      if (!deletedLanguage) {
        return res.status(404).send({ message: "Language not found" });
      }
      res.send({ message: "Language deleted successfully" });
    } catch (err) {
      res.status(500).send({ message: "Error deleting language", error: err.message });
    }
  },
};

module.exports = languageController;