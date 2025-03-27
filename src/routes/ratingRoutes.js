const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createRatingValidation,
  updateRatingValidation,
} = require("../middleware/validators/ratingValidators");
const {
  createRating,
  updateRating,
  deleteRating,
  getEventRatings,
} = require("../controllers/ratingController");

/**
 * @swagger
 * /ratings/event/{eventId}:
 *   get:
 *     summary: Get all ratings for an event
 *     tags: [Ratings]
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
 *         description: List of ratings for the event
 *       404:
 *         description: Event not found
 */
router.get("/event/:eventId", getEventRatings);

/**
 * @swagger
 * /ratings:
 *   post:
 *     summary: Create a new rating for an event
 *     tags: [Ratings]
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
 *               - rating
 *             properties:
 *               eventId:
 *                 type: string
 *                 format: uuid
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Rating created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       409:
 *         description: User has already rated this event
 */
router.post("/", authenticate, createRatingValidation, validate, createRating);

/**
 * @swagger
 * /ratings/{id}:
 *   put:
 *     summary: Update a rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Rating ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the owner)
 *       404:
 *         description: Rating not found
 */
router.put(
  "/:id",
  authenticate,
  updateRatingValidation,
  validate,
  updateRating
);

/**
 * @swagger
 * /ratings/{id}:
 *   delete:
 *     summary: Delete a rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Rating ID
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the owner)
 *       404:
 *         description: Rating not found
 */
router.delete("/:id", authenticate, deleteRating);

module.exports = router;
