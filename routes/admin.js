const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/themes', adminController.themes);

router.post('/theme', adminController.createTheme);

router.post('/theme/:themeId', adminController.updateTheme);

router.delete('/theme/:themeId', adminController.deleteTheme);

router.post('/theme/:themeId/readings', adminController.addReading);

router.delete(
  '/theme/:themeId/readings/:readingId',
  adminController.deleteReading
);

router.post('/theme/votes/:themeId', adminController.resetVotes);

module.exports = router;
