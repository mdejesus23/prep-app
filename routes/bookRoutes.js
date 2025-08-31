const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/:bookId', bookController.getBook);

module.exports = router;
