const express = require('express');
const router = express.Router();

const preparationController = require('../controllers/preparationController');
const authController = require('../controllers/authController');

router.get('/', authController.protect, preparationController.getAllThemes);

router.get(
  '/getTheme/:themeId',
  authController.protect,
  preparationController.themeWithReadings
);

router.post(
  '/voteReading/:readingId',
  authController.protect,
  preparationController.voteReading
);

router.get(
  '/getTheme/:themeId/withVotes',
  authController.protect,
  preparationController.themeWithReadingsWithVotes
);

module.exports = router;
