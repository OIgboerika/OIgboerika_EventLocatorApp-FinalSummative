const { Rating, Event, User } = require("../models");
const { Op } = require("sequelize");

const createRating = async (req, res) => {
  try {
    const { eventId, rating, review } = req.body;

    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    // Check if user has already rated this event
    const existingRating = await Rating.findOne({
      where: {
        userId: req.user.id,
        eventId: eventId,
      },
    });

    if (existingRating) {
      return res.status(400).json({
        status: "error",
        message: "You have already rated this event",
      });
    }

    // Create rating
    const newRating = await Rating.create({
      userId: req.user.id,
      eventId: eventId,
      rating,
      review,
    });

    // Update event's average rating and total ratings
    const allRatings = await Rating.findAll({
      where: { eventId: eventId },
    });

    const totalRatings = allRatings.length;
    const averageRating =
      allRatings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings;

    await event.update({
      averageRating,
      totalRatings,
    });

    // Fetch rating with user details
    const ratingWithUser = await Rating.findByPk(newRating.id, {
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName"],
        },
      ],
    });

    res.status(201).json({
      status: "success",
      data: { rating: ratingWithUser },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const ratingId = req.params.id;

    const existingRating = await Rating.findByPk(ratingId);
    if (!existingRating) {
      return res.status(404).json({
        status: "error",
        message: "Rating not found",
      });
    }

    // Check if user owns this rating
    if (existingRating.userId !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this rating",
      });
    }

    // Update rating
    await existingRating.update({
      rating,
      review,
    });

    // Update event's average rating
    const event = await Event.findByPk(existingRating.eventId);
    if (event) {
      // Recalculate average rating
      const ratings = await Rating.findAll({
        where: { eventId: event.id },
      });

      const totalRatings = ratings.length;
      const averageRating =
        ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings;

      await event.update({
        averageRating,
        totalRatings,
      });
    }

    // Fetch updated rating with user details
    const updatedRating = await Rating.findByPk(ratingId, {
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName"],
        },
      ],
    });

    res.json({
      status: "success",
      data: { rating: updatedRating },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteRating = async (req, res) => {
  try {
    const ratingId = req.params.id;

    const rating = await Rating.findByPk(ratingId);
    if (!rating) {
      return res.status(404).json({
        status: "error",
        message: "Rating not found",
      });
    }

    // Check if user owns this rating
    if (rating.userId !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this rating",
      });
    }

    // Store event ID before deleting rating
    const eventId = rating.eventId;

    // Delete rating
    await rating.destroy();

    // Update event's average rating
    const event = await Event.findByPk(eventId);
    if (event) {
      // Recalculate average rating
      const ratings = await Rating.findAll({
        where: { eventId: eventId },
      });

      const totalRatings = ratings.length;
      const averageRating =
        totalRatings > 0
          ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings
          : 0;

      await event.update({
        averageRating,
        totalRatings,
      });
    }

    res.json({
      status: "success",
      message: "Rating deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getEventRatings = async (req, res) => {
  try {
    const { eventId } = req.params;

    const ratings = await Rating.findAll({
      where: { eventId: eventId },
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      status: "success",
      data: { ratings },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createRating,
  updateRating,
  deleteRating,
  getEventRatings,
};
