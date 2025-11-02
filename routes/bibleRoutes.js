const express = require('express');
const router = express.Router();
const bibleController = require('../controllers/bibleController');

router.get('/:verse', bibleController.getBibleReading);

module.exports = router;
