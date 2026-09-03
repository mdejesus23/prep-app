const express = require('express');
const router = express.Router();
const liturgicalController = require('../controllers/liturgicalController');

/**
 * @openapi
 * /api/v1/liturgy/{year}/{month}/{day}:
 *   get:
 *     tags: [Liturgical Calendar]
 *     summary: Get the liturgical calendar for a date
 *     description: >-
 *       Public — no authentication required. Proxies
 *       [calapi.inadiutorium.cz](http://calapi.inadiutorium.cz) (default
 *       calendar, English) and returns its payload verbatim under `data`.
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema: { type: integer }
 *         example: 2026
 *       - in: path
 *         name: month
 *         required: true
 *         schema: { type: integer, minimum: 1, maximum: 12 }
 *         example: 12
 *       - in: path
 *         name: day
 *         required: true
 *         schema: { type: integer, minimum: 1, maximum: 31 }
 *         example: 25
 *     responses:
 *       200:
 *         description: The calendar day as returned by the upstream API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     date: { type: string, format: date, example: '2026-12-25' }
 *                     season: { type: string, example: christmas }
 *                     season_week: { type: integer, example: 1 }
 *                     weekday: { type: string, example: friday }
 *                     celebrations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title: { type: string, example: The Nativity of the Lord }
 *                           colour: { type: string, example: white }
 *                           rank: { type: string, example: Solemnity }
 *                           rank_num: { type: number, example: 1.1 }
 *       404:
 *         description: No data returned from the third-party API
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/:year/:month/:day', liturgicalController.getLiturgicalCalendar);

module.exports = router;
