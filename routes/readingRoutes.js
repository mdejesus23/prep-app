const express = require('express');
const readingController = require('../controllers/readingController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes after this middleware
router.use(authController.protect);

/**
 * @openapi
 * /api/v1/admin/themes/{themeId}/readings:
 *   get:
 *     tags: [Readings]
 *     summary: Get a theme with its readings populated
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: themeId
 *         required: true
 *         schema: { type: string }
 *         description: Theme id
 *     responses:
 *       200:
 *         description: The theme, with its `readings` array populated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Theme' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   post:
 *     tags: [Readings]
 *     summary: Add a reading to a theme
 *     description: >-
 *       `themeId` is taken from the path and `userId` from the token;
 *       `voteCount` starts at 0.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: themeId
 *         required: true
 *         schema: { type: string }
 *         description: Theme id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reading, category]
 *             properties:
 *               reading: { type: string, example: 'John 3:16-21' }
 *               category: { type: string, example: gospel }
 *     responses:
 *       201:
 *         description: Reading created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Reading' }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router
  .route('/')
  .get(readingController.getThemesWithReadings)
  .post(
    readingController.setThemeAndUserIds,
    readingController.addReadingToTheme
  );

/**
 * @openapi
 * /api/v1/admin/themes/{themeId}/readings/reset-votes:
 *   post:
 *     tags: [Readings]
 *     summary: Reset the vote count of every reading in a theme
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: themeId
 *         required: true
 *         schema: { type: string }
 *         description: Theme id
 *     responses:
 *       200:
 *         description: All votes for the theme's readings set to 0
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     theme: { $ref: '#/components/schemas/Theme' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: No theme with that id, or the theme has no readings
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.route('/reset-votes').post(readingController.resetVotes);

/**
 * @openapi
 * /api/v1/admin/themes/{themeId}/readings/{readingId}:
 *   delete:
 *     tags: [Readings]
 *     summary: Delete a reading from a theme
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: themeId
 *         required: true
 *         schema: { type: string }
 *         description: Theme id
 *       - in: path
 *         name: readingId
 *         required: true
 *         schema: { type: string }
 *         description: Reading id
 *     responses:
 *       204:
 *         description: Reading deleted (no content)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.route('/:readingId').delete(readingController.deleteReading);

module.exports = router;
