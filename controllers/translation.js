const fetch = require('node-fetch');
const Translation = require('../models/Translation'); 

const ENDPOINTS = [
  "https://collonoid.tasport1.workers.dev/translate",
  "https://655.mtis.workers.dev/translate",
  "https://emergency-tas-backup1.uncoverclimatix.workers.dev/translate"
];

const translation = {
  // Create translation
  createTranslation: async (req, res) => {
    const { text, sourceLang = 'en', targetLang = 'fr' } = req.body;

   
    if (!text || !sourceLang || !targetLang) {
      return res.status(400).send({ message: 'Text, source language, and target language are required.' });
    }

    try {
      let translatedText = null;

      for (const endpoint of ENDPOINTS) {
        const params = {
          text,
          source_lang: sourceLang,
          target_lang: targetLang
        };

        const url = new URL(endpoint);
        url.search = new URLSearchParams(params).toString();

        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            translatedText = data.response.translated_text;
            break;
          } else {
            console.error(`Error at ${endpoint}: ${response.status} - ${response.statusText}`);
          }
        } catch (error) {
          console.error(`Request exception at ${endpoint}:`, error);
        }
      }

      if (translatedText) {
       
        const newTranslation = new Translation({
          text,
          sourceLang,
          targetLang,
          translatedText
        });

        await newTranslation.save();
        return res.status(201).send({ message: 'Translation created successfully', translation: newTranslation });
      } else {
        return res.status(500).send({ message: 'All translation endpoints failed.' });
      }

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).send({ message: 'An error occurred while processing the translation.' });
    }
  },

  getTranslations: async (req, res) => {
    try {
      const translations = await Translation.find();
      res.send(translations);
    } catch (err) {
      res.status(500).send({ message: 'Error retrieving translations', error: err.message });
    }
  },
};

module.exports = translation;
