const express = require('express');
const router = express.Router();

const preparionController = require('../controllers/preparationController');
const authController = require('../controllers/authController');

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/themes', preparionController.getAllThemes);

router.get('/themes/:themeId/readings', preparionController.themeWithReadings);

router.post('/vote-reading/:readingId', preparionController.voteReading);

router.get(
  '/theme/:themeId/reading-votes',
  preparionController.themeWithReadingsWithVotes
);

module.exports = router;
