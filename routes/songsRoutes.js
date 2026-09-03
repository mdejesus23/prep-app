const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

const authController = require('../controllers/authController');

// Protect all routes after this middleware
// router.use(authController.protect);

/**
 * @openapi
 * /api/v1/songs:
 *   get:
 *     tags: [Songs]
 *     summary: List songs
 *     description: Public — no authentication required.
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *       - $ref: '#/components/parameters/Sort'
 *       - $ref: '#/components/parameters/Fields'
 *       - $ref: '#/components/parameters/Search'
 *     responses:
 *       200:
 *         description: Paginated list of songs
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Song' }
 */
router.route('/').get(songController.songs);

/**
 * @openapi
 * /api/v1/songs/{songId}:
 *   get:
 *     tags: [Songs]
 *     summary: Get a single song
 *     description: >-
 *       Public — no authentication required. `imageUrl` is rewritten to an
 *       optimized Cloudinary delivery URL.
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema: { type: string }
 *         description: Song id
 *     responses:
 *       200:
 *         description: The song
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/Song' }
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.route('/:songId').get(songController.getSong);

module.exports = router;
