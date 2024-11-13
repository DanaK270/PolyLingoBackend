// models/reply.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the reply schema
const replySchema = new Schema(
  {
    issue: { type: String, required: true },
    comment: { type: String, required: true },
    parentReply: { type: Schema.Types.ObjectId, ref: 'Reply', default: null },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Add userId to track the creator
  },
  { timestamps: true }
);


const Reply = mongoose.model('Reply', replySchema);

module.exports = { Reply };
