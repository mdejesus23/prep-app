const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

/**
 * @openapi
 * /api/v1/books/{bookId}:
 *   get:
 *     tags: [Books]
 *     summary: Get a single book
 *     description: Public — no authentication required.
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema: { type: string }
 *         description: Book id
 *     responses:
 *       200:
 *         description: The book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/Book' }
 *       404:
 *         description: No book found in the database
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/:bookId', bookController.getBook);

module.exports = router;
