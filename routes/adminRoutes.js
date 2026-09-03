const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

const readingRouter = require('./readingRoutes');

// Protect all routes after this middleware
router.use(authController.protect);

router.use('/themes/:themeId/readings', readingRouter);
// router.use('/themes/:slug/readings', readingRouter);

/**
 * @openapi
 * /api/v1/admin/themes:
 *   get:
 *     tags: [Admin]
 *     summary: List the themes owned by the current user
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
 *         description: Paginated list of the caller's themes
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
 *   post:
 *     tags: [Admin]
 *     summary: Create a theme
 *     description: The theme is owned by the authenticated user; `userId` is set from the token.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, passcode]
 *             properties:
 *               title: { type: string, example: Advent Sunday Mass }
 *               description: { type: string, example: Readings for the first Sunday of Advent. }
 *               passcode: { type: string, maxLength: 10, example: adv2026 }
 *               imageUrl: { type: string, example: 'https://res.cloudinary.com/demo/theme.jpg' }
 *     responses:
 *       201:
 *         description: Theme created
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
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router
  .route('/themes')
  .get(adminController.themes)
  .post(adminController.createTheme);

/**
 * @openapi
 * /api/v1/admin/themes/{themeId}:
 *   patch:
 *     tags: [Admin]
 *     summary: Update a theme owned by the current user
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
 *             properties:
 *               title: { type: string, example: Advent Sunday Mass }
 *               description: { type: string, example: Updated description. }
 *               passcode: { type: string, maxLength: 10, example: adv2026 }
 *               imageUrl: { type: string, example: 'https://res.cloudinary.com/demo/theme.jpg' }
 *     responses:
 *       200:
 *         description: Theme updated
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
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a theme owned by the current user
 *     description: Also deletes every reading belonging to the theme.
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
 *       204:
 *         description: Theme and its readings deleted (no content)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route('/themes/:themeId')
  .patch(adminController.updateTheme)
  .delete(adminController.deleteTheme);

module.exports = router;
