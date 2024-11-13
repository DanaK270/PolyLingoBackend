const express = require('express');
const router = express.Router();
const translationController = require('../controllers/translation');


router.post('/translate', translationController.createTranslation);
router.get('/', translationController.getTranslations);


module.exports = router;
