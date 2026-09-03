const express = require('express');
const router = express.Router();

const preparionController = require('../controllers/preparationController');
const authController = require('../controllers/authController');

// Protect all routes after this middleware
router.use(authController.protect);

/**
 * @openapi
 * /api/v1/preparation/themes:
 *   get:
 *     tags: [Preparation]
 *     summary: List all themes
 *     description: Unlike the admin listing, this returns every theme, not only the caller's.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *       - $ref: '#/components/parameters/Sort'
 *       - $ref: '#/components/parameters/Fields'
 *       - $ref: '#/components/parameters/Search'
 *     responses:
 *       200:
 *         description: Paginated list of themes
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Theme' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/themes', preparionController.getAllThemes);

/**
 * @openapi
 * /api/v1/preparation/themes/{themeId}/readings:
 *   post:
 *     tags: [Preparation]
 *     summary: Unlock a theme with its passcode and get its readings
 *     description: >-
 *       Verifies the theme passcode and, on success, returns the theme with its
 *       readings populated and sets a `themeId` cookie valid for 24 hours.
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
 *             required: [passcode]
 *             properties:
 *               passcode: { type: string, example: adv2026 }
 *     responses:
 *       200:
 *         description: Passcode accepted (`themeId` cookie set)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 themeId: { type: string, example: 665f1c2a9b1e2a0012ab34cd }
 *                 themeWithReadings: { $ref: '#/components/schemas/Theme' }
 *       401:
 *         description: Passcode does not match, or not authenticated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: No theme found with that ID
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post(
  '/themes/:themeId/readings',
  preparionController.postThemeWithReadings
);

/**
 * @openapi
 * /api/v1/preparation/vote-reading/{readingId}:
 *   post:
 *     tags: [Preparation]
 *     summary: Toggle the current user's vote on a reading
 *     description: >-
 *       Votes if the user has not voted for this reading yet, unvotes otherwise,
 *       adjusting the reading's `voteCount` accordingly (never below 0).
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: readingId
 *         required: true
 *         schema: { type: string }
 *         description: Reading id
 *     responses:
 *       200:
 *         description: Vote toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message:
 *                   type: string
 *                   enum: [Vote counted!, Unvote counted!]
 *                   example: Vote counted!
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Reading not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post('/vote-reading/:readingId', preparionController.voteReading);

/**
 * @openapi
 * /api/v1/preparation/theme/{themeId}/reading-votes:
 *   get:
 *     tags: [Preparation]
 *     summary: Get a theme with its readings and their current vote counts
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
 *         description: The theme with populated readings (`themeWithReadings` is null if no theme matches)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 themeWithReadings: { $ref: '#/components/schemas/Theme' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/theme/:themeId/reading-votes',
  preparionController.themeWithReadingsWithVotes
);

module.exports = router;
