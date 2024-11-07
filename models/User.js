const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordDigest: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
    // TODO: uncomment it after creating the language model
    // learningLanguages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)

module.exports = User
