const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword); // patch for manipulating a document

// needs to authenticate user before updating user info.
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.get('/me', authController.protect, userController.getUser);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.get('/', authController.protect, userController.getAllUsers);

module.exports = router;
