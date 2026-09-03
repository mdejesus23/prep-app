const express = require('express');
const router = express.Router();
const bibleController = require('../controllers/bibleController');

/**
 * @openapi
 * /api/v1/bible/{verse}:
 *   get:
 *     tags: [Bible]
 *     summary: Fetch a Bible passage
 *     description: >-
 *       Public — no authentication required. Proxies
 *       [bible-api.com](https://bible-api.com) and returns its payload verbatim
 *       under `data`.
 *     parameters:
 *       - in: path
 *         name: verse
 *         required: true
 *         schema: { type: string }
 *         example: john+3:16
 *         description: Passage reference in bible-api.com format, e.g. `john+3:16` or `romans+12:1-2`.
 *     responses:
 *       200:
 *         description: The passage as returned by the upstream API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference: { type: string, example: 'John 3:16' }
 *                     text: { type: string, example: 'For God so loved the world...' }
 *                     translation_id: { type: string, example: web }
 *                     translation_name: { type: string, example: World English Bible }
 *                     verses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           book_name: { type: string, example: John }
 *                           chapter: { type: integer, example: 3 }
 *                           verse: { type: integer, example: 16 }
 *                           text: { type: string, example: 'For God so loved the world...' }
 *       404:
 *         description: No data returned from the third-party API
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/:verse', bibleController.getBibleReading);

module.exports = router;
