const express = require('express');
const router = express.Router();
const liturgicalController = require('../controllers/liturgicalController');

router.get('/:year/:month/:day', liturgicalController.getLiturgicalCalendar);

module.exports = router;
