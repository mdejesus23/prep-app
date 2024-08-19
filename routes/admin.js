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
  adminController.readings
);

router.post(
  '/theme/:themeId/addReading',
  authController.protect,
  adminController.addReading
);

router.delete(
  '/reading/:readingId',
  authController.protect,
  adminController.deleteReading
);

router.post(
  '/theme/votes/:themeId',
  authController.protect,
  adminController.resetVotes
);

module.exports = router;
