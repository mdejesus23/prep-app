const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

/**
 * @openapi
 * /api/v1/users/signup:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     description: Creates the account, sends a welcome email and logs the user in.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password, confirmPassword]
 *             properties:
 *               username: { type: string, example: johndoe }
 *               email: { type: string, format: email, example: john@example.com }
 *               password: { type: string, format: password, minLength: 8, example: pass1234 }
 *               confirmPassword: { type: string, format: password, example: pass1234 }
 *     responses:
 *       201:
 *         description: User created and logged in (JWT returned and set as the `jwt` cookie)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 token: { type: string, example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Invalid input, passwords do not match, or email/username already in use
 */
router.post('/signup', authController.signup);

/**
 * @openapi
 * /api/v1/users/login:
 *   post:
 *     tags: [Users]
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: john@example.com }
 *               password: { type: string, format: password, example: pass1234 }
 *     responses:
 *       200:
 *         description: Logged in successfully (JWT returned and set as the `jwt` cookie)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 token: { type: string, example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Incorrect email or password
 */
router.post('/login', authController.login);

/**
 * @openapi
 * /api/v1/users/logout:
 *   post:
 *     tags: [Users]
 *     summary: Log out the current user
 *     description: Clears the `jwt` cookie.
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', authController.logout);

/**
 * @openapi
 * /api/v1/users/forgotPassword:
 *   post:
 *     tags: [Users]
 *     summary: Request a password reset email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email, example: john@example.com }
 *     responses:
 *       200:
 *         description: Reset token sent to the user's email
 *       404:
 *         description: No user found with that email address
 */
router.post('/forgotPassword', authController.forgotPassword);

/**
 * @openapi
 * /api/v1/users/resetPassword/{token}:
 *   patch:
 *     tags: [Users]
 *     summary: Reset password using the emailed token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *         description: The password reset token from the email link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password, confirmPassword]
 *             properties:
 *               password: { type: string, format: password, minLength: 8, example: newpass1234 }
 *               confirmPassword: { type: string, format: password, example: newpass1234 }
 *     responses:
 *       200:
 *         description: Password reset and user logged in (new JWT issued)
 *       400:
 *         description: Token is invalid or has expired, or passwords do not match
 */
router.patch('/resetPassword/:token', authController.resetPassword); // patch for manipulating a document

/**
 * @openapi
 * /api/v1/users/reset-votes:
 *   post:
 *     tags: [Users]
 *     summary: Reset the current user's votes
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User's votes reset
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
// needs to authenticate user before updating user info.
router.post(
  '/reset-votes',
  authController.protect,
  userController.resetUserVotes
);

/**
 * @openapi
 * /api/v1/users/updateMyPassword:
 *   patch:
 *     tags: [Users]
 *     summary: Update the current user's password
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword, confirmNewPassword]
 *             properties:
 *               currentPassword: { type: string, format: password, example: pass1234 }
 *               newPassword: { type: string, format: password, minLength: 8, example: newpass1234 }
 *               confirmNewPassword: { type: string, format: password, example: newpass1234 }
 *     responses:
 *       200:
 *         description: Password updated and new JWT issued
 *       401:
 *         description: Current password is wrong, or not authenticated
 */
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

/**
 * @openapi
 * /api/v1/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get the current user's profile
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: The authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/User' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/me', authController.protect, userController.getUser);

/**
 * @openapi
 * /api/v1/users/updateMe:
 *   patch:
 *     tags: [Users]
 *     summary: Update the current user's username/email
 *     description: Only `username` and `email` are applied; any other field in the body is ignored.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string, example: johndoe }
 *               email: { type: string, format: email, example: john@example.com }
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Attempted to update the password on this route
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.patch('/updateMe', authController.protect, userController.updateMe);

/**
 * @openapi
 * /api/v1/users/deleteMe:
 *   delete:
 *     tags: [Users]
 *     summary: Deactivate the current user's account
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: Account deactivated (no content)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.delete('/deleteMe', authController.protect, userController.deleteMe);

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     description: Returns every active user. Any authenticated user may call this.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 results: { type: integer, example: 12 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/User' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', authController.protect, userController.getAllUsers);

/**
 * @openapi
 * /api/v1/users/upload-profile-image:
 *   patch:
 *     tags: [Users]
 *     summary: Upload the current user's profile image
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image uploaded
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.patch(
  '/upload-profile-image',
  authController.protect,
  userController.upload, // multer middleware
  userController.uploadProfileImage
);

module.exports = router;
