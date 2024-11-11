const mongoose = require('mongoose');
const { Schema } = mongoose;



const discussionSchema = new Schema(
  {
    name: { type: String, default: 'Discussion Forum' },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    issues: [{ type: Schema.Types.ObjectId, ref: 'Issue' }],
  },
  { timestamps: true }
);
// Create the models
const Discussion = mongoose.model('Discussion', discussionSchema);
// Export the models
module.exports =  Discussion ;