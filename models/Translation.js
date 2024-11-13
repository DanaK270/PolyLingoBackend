const mongoose = require('mongoose');
const { Schema } = mongoose;
const translationSchema = new mongoose.Schema({
  text: { type: String, required: true }, 
  sourceLang: { type: String, required: true }, 
  targetLang: { type: String, required: true }, 
  translatedText: { type: String, required: true },  
 
});

const Translation = mongoose.model('Translation', translationSchema);

module.exports = Translation;
