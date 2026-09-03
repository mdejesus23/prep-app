const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const resultController = require('../controllers/resultController');
const userController = require('../controllers/userController');

// Protect all routes after this middleware
router.use(authController.protect);

/**
 * @openapi
 * /api/v1/results:
 *   get:
 *     tags: [Results]
 *     summary: List the preparation results owned by the current user
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
 *         description: Paginated list of the caller's results
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Result' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     tags: [Results]
 *     summary: Save a preparation result
 *     description: The result is owned by the authenticated user; `userId` is set from the token.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - entranceSong
 *               - firstReading
 *               - firstPsalm
 *               - secondReading
 *               - secondPsalm
 *               - thirdReading
 *               - thirdPsalm
 *               - gospel
 *               - finalSong
 *             properties:
 *               title: { type: string, example: Advent Sunday Mass }
 *               entranceSong: { type: string, example: 'O Come, O Come Emmanuel' }
 *               firstReading: { type: string, example: 'Isaiah 2:1-5' }
 *               firstPsalm: { type: string, example: Psalm 122 }
 *               secondReading: { type: string, example: 'Romans 13:11-14' }
 *               secondPsalm: { type: string, example: Psalm 25 }
 *               thirdReading: { type: string, example: 'Isaiah 11:1-10' }
 *               thirdPsalm: { type: string, example: Psalm 72 }
 *               gospel: { type: string, example: 'Matthew 24:37-44' }
 *               finalSong: { type: string, example: Come Thou Long Expected Jesus }
 *     responses:
 *       201:
 *         description: Result created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Result' }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router
  .route('/')
  .get(resultController.preparationResults)
  .post(resultController.addpreparationResult);

/**
 * @openapi
 * /api/v1/results/{resultId}:
 *   patch:
 *     tags: [Results]
 *     summary: Update a preparation result owned by the current user
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: resultId
 *         required: true
 *         schema: { type: string }
 *         description: Result id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Result'
 *     responses:
 *       200:
 *         description: Result updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Result' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     tags: [Results]
 *     summary: Delete a preparation result owned by the current user
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: resultId
 *         required: true
 *         schema: { type: string }
 *         description: Result id
 *     responses:
 *       204:
 *         description: Result deleted (no content)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route('/:resultId')
  .delete(resultController.deleteResult)
  .patch(resultController.updateResult);

module.exports = router;
