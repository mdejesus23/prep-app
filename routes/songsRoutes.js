const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

const authController = require('../controllers/authController');

// Protect all routes after this middleware
// router.use(authController.protect);

router.route('/').get(songController.songs);

router.route('/:songId').get(songController.getSong);

module.exports = router;
