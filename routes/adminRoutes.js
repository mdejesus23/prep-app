const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

const readingRouter = require('./readingRoutes');

// Protect all routes after this middleware
router.use(authController.protect);

router.use('/themes/:themeId/readings', readingRouter);

router
  .route('/themes')
  .get(adminController.themes)
  .post(adminController.createTheme);

router
  .route('/themes/:themeId')
  .patch(adminController.updateTheme)
  .delete(adminController.deleteTheme);

module.exports = router;
