const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createEventValidation,
  updateEventValidation,
  searchNearbyValidation,
  getEventsValidation,
} = require("../middleware/validators/eventValidators");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  searchNearbyEvents,
} = require("../controllers/eventController");

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events with optional filters
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, cancelled, completed]
 *         description: Filter by event status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter events after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter events before this date
 *     responses:
 *       200:
 *         description: List of events
 */
router.get("/", getEventsValidation, validate, getEvents);

/**
 * @swagger
 * /events/nearby:
 *   get:
 *     summary: Search for events near a location
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *         description: Latitude of the search location
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *         description: Longitude of the search location
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Search radius in kilometers
 *     responses:
 *       200:
 *         description: List of nearby events
 */
router.get("/nearby", searchNearbyValidation, validate, searchNearbyEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
router.get("/:id", getEventById);

// Protected routes
router.post("/", authenticate, createEventValidation, validate, createEvent);
router.put("/:id", authenticate, updateEventValidation, validate, updateEvent);
router.delete("/:id", authenticate, isAdmin, deleteEvent);

module.exports = router;
