const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

router.get('/themes', authController.protect, adminController.themes);

router.post('/theme', authController.protect, adminController.createTheme);

router.patch(
  '/theme/:themeId',
  authController.protect,
  adminController.updateTheme
);

router.delete(
  '/theme/:themeId',
  authController.protect,
  adminController.deleteTheme
);

router.get(
  '/theme/:themeId/readings',
  authController.protect,
  adminController.getThemesWithReadings
);

router.post(
  '/theme/:themeId/addReading',
  authController.protect,
  adminController.addReadingToTheme
);

router.delete(
  '/reading/:readingId',
  authController.protect,
  adminController.deleteReading
);

router.post(
  '/theme/:themeId/resetVotes',
  authController.protect,
  adminController.resetVotes
);

router
  .route('/prepResults')
  .get(authController.protect, adminController.preparationResults)
  .post(authController.protect, adminController.addpreparationResult);

router.delete(
  '/result/:resultId',
  authController.protect,
  adminController.deleteResult
);

module.exports = router;
