const express = require('express');
const router = express.Router();
const liturgyOfHoursController = require('../controllers/liturgyOfHoursController');

/**
 * @openapi
 * /api/v1/liturgy-of-hours:
 *   get:
 *     tags: [Liturgy of Hours]
 *     summary: List Liturgy of the Hours entries
 *     description: Public — no authentication required.
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *       - $ref: '#/components/parameters/Sort'
 *       - $ref: '#/components/parameters/Fields'
 *       - $ref: '#/components/parameters/Search'
 *     responses:
 *       200:
 *         description: Paginated list of entries
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/LiturgyOfHours' }
 */
router.route('/').get(liturgyOfHoursController.getAllLiturgyOfHours);

/**
 * @openapi
 * /api/v1/liturgy-of-hours/filter:
 *   get:
 *     tags: [Liturgy of Hours]
 *     summary: Filter entries by week and/or season
 *     description: >-
 *       Public — no authentication required. `week` matches exactly, `season`
 *       matches case-insensitively as a substring. Omitting both returns
 *       everything.
 *     parameters:
 *       - in: query
 *         name: week
 *         schema: { type: string }
 *         example: I
 *         description: Exact week label.
 *       - in: query
 *         name: season
 *         schema: { type: string }
 *         example: advent
 *         description: Case-insensitive partial match on the season.
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *       - $ref: '#/components/parameters/Sort'
 *       - $ref: '#/components/parameters/Fields'
 *     responses:
 *       200:
 *         description: Paginated list of matching entries
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/LiturgyOfHours' }
 */
router.route('/filter').get(liturgyOfHoursController.getLiturgyByWeekAndSeason);

/**
 * @openapi
 * /api/v1/liturgy-of-hours/{id}:
 *   get:
 *     tags: [Liturgy of Hours]
 *     summary: Get a single Liturgy of the Hours entry
 *     description: Public — no authentication required.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Entry id
 *     responses:
 *       200:
 *         description: The entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/LiturgyOfHours' }
 *       404:
 *         description: No liturgy entry found with that ID
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.route('/:id').get(liturgyOfHoursController.getLiturgyOfHours);

module.exports = router;
