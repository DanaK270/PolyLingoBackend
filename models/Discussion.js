const mongoose = require('mongoose');
const { Schema } = mongoose;



const discussionSchema = new Schema({
  name: { type: String, default: 'Discussion Forum' },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',  // Ensure this points to the correct model
    required: true,
  },
  issues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',  // Or whatever model is related to issues
  }],
});

// Create the models
const Discussion = mongoose.model('Discussion', discussionSchema);
// Export the models
module.exports =  Discussion ;

