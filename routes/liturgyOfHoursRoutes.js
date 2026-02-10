const express = require('express');
const router = express.Router();
const liturgyOfHoursController = require('../controllers/liturgyOfHoursController');

router.route('/').get(liturgyOfHoursController.getAllLiturgyOfHours);

router.route('/filter').get(liturgyOfHoursController.getLiturgyByWeekAndSeason);

router.route('/:id').get(liturgyOfHoursController.getLiturgyOfHours);

module.exports = router;
