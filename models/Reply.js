// models/reply.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the reply schema
const replySchema = new Schema(
  {
    issue: { type: String, required: true },  // Content of the reply
    comment: { type: String, required: true },  // Field to store the comment text
    parentReply: { type: Schema.Types.ObjectId, ref: 'Reply', default: null },  // Reference to a parent reply if it's a nested reply
    replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],  // Nested replies to this reply
  },
  { timestamps: true }
);

const Reply = mongoose.model('Reply', replySchema);

module.exports = { Reply };
