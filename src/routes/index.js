const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const eventRoutes = require("./eventRoutes");
const categoryRoutes = require("./categoryRoutes");
const ratingRoutes = require("./ratingRoutes");
const favoriteRoutes = require("./favoriteRoutes");
const notificationRoutes = require("./notificationRoutes");

// Mount routes
router.use("/auth", authRoutes);
router.use("/events", eventRoutes);
router.use("/categories", categoryRoutes);
router.use("/ratings", ratingRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/notifications", notificationRoutes);

module.exports = router;
