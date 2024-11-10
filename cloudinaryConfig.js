const cloudinary = require('cloudinary').v2;

cloudinary.config({
  CLOUD_NAME: 'dtjgtwrtk',
  API_KEY: '347854275332484',
  API_SECRET: 'htBhNpch57digJtF9RVgTeNAqMg',
});

module.exports = cloudinary;
