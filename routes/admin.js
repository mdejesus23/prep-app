const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

router.post('/add-theme', adminController.createTheme);

router.post('/theme/:themeId', adminController.updateTheme);

router.delete('/theme/:themeId', adminController.deleteTheme);

router.post('/theme/:themeId/readings', adminController.addReading);

router.delete(
  '/theme/:themeId/readings/:readingId',
  adminController.deleteReading
);

router.post('/theme/reset-votes/:themeId', adminController.resetVotes);

module.exports = router;
