const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const resultController = require('../controllers/resultController');

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route('/')
  .get(resultController.preparationResults)
  .post(resultController.addpreparationResult);

router
  .route('/:resultId')
  .delete(resultController.deleteResult)
  .patch(resultController.updateResult);

module.exports = router;
