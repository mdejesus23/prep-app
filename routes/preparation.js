const express = require('express');
const router = express.Router();

const preparationController = require('../controllers/preparation');

router.get('/', preparationController.getAllThemes);

router
  .route('/readings/:themeId')
  .get(preparationController.getReadings)
  .post(preparationController.checkPasscode);

module.exports = router;
