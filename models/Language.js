const mongoose = require('mongoose');
const { Schema } = mongoose;


const languageSchema = new mongoose.Schema({
  languagename: { type: String, required: true },
  difficulties: { type: String, required: true },
  description: { type: String }, 
  fields: [{ type: [mongoose.Schema.Types.ObjectId], ref: 'Lesson' }],
}, { timestamps: true });
const Language=mongoose.model('Language',languageSchema);
module.exports=Language;