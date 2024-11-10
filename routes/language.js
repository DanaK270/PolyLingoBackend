const express = require("express");
const multer = require("multer");
const router = express.Router();
const languageController = require("../controllers/language");

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

// Route to create a new language with lessons
router.post("/languages", upload.array('videos'), languageController.createlanguage);
router.get("/languages", languageController.getlanguage);
router.get("/languages/:id", languageController.getlanguageById);
router.put("/languages/:id", languageController.updatelanguage);
router.delete("/languages/:id", languageController.deletelanguage);



module.exports = router;