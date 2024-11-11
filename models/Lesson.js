const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  video: [
    {
      url: { type: String, required: true }, 
      public_id: { type: String },
    },
  ],
  discussion: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Discussion'  // Assuming 'Discussion' model
  },
});

const Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;
