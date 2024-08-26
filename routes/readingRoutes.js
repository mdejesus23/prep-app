const express = require('express');
const readingController = require('../controllers/readingController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route('/')
  .get(readingController.getThemesWithReadings)
  .post(
    readingController.setThemeAndUserIds,
    readingController.addReadingToTheme
  );

router.route('/reset-votes').post(readingController.resetVotes);
router.route('/:readingId').delete(readingController.deleteReading);

module.exports = router;
