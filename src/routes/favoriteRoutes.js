const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  addFavoriteValidation,
  removeFavoriteValidation,
} = require("../middleware/validators/favoriteValidators");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoriteController");

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get user's favorite events
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite events
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, getFavorites);

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Add an event to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *             properties:
 *               eventId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Event added to favorites
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       409:
 *         description: Event already in favorites
 */
router.post("/", authenticate, addFavoriteValidation, validate, addFavorite);

/**
 * @swagger
 * /favorites/{eventId}:
 *   delete:
 *     summary: Remove an event from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event removed from favorites
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found in favorites
 */
router.delete(
  "/:eventId",
  authenticate,
  removeFavoriteValidation,
  validate,
  removeFavorite
);

module.exports = router;
