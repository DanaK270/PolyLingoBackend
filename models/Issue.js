const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the reply schema


// Define the issue schema
const issueSchema = new Schema(
  {
    comment: { type: String, required: true },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }], 
    discussionId: { type: Schema.Types.ObjectId, ref: 'Discussion', required: true }
  },
  { timestamps: true }
);
// Create the models
const Issue = mongoose.model('Issue', issueSchema);


// Export the models
module.exports = { Issue };