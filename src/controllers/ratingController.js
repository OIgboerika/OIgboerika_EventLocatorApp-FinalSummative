const { Rating, Event, User } = require("../models");

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
        eventId,
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
      eventId,
      rating,
      review,
    });

    // Update event's average rating and total ratings
    const eventRatings = await Rating.findAll({
      where: { eventId },
    });

    const totalRatings = eventRatings.length;
    const averageRating =
      eventRatings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings;

    await event.update({
      averageRating,
      totalRatings,
    });

    // Fetch rating with user details
    const ratingWithUser = await Rating.findByPk(newRating.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
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

    await existingRating.update({
      rating,
      review,
    });

    // Update event's average rating
    const eventRatings = await Rating.findAll({
      where: { eventId: existingRating.eventId },
    });

    const totalRatings = eventRatings.length;
    const averageRating =
      eventRatings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings;

    await Event.update(
      {
        averageRating,
        totalRatings,
      },
      {
        where: { id: existingRating.eventId },
      }
    );

    // Fetch updated rating with user details
    const updatedRating = await Rating.findByPk(ratingId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
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
    const rating = await Rating.findByPk(req.params.id);
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

    const eventId = rating.eventId;
    await rating.destroy();

    // Update event's average rating
    const eventRatings = await Rating.findAll({
      where: { eventId },
    });

    const totalRatings = eventRatings.length;
    const averageRating =
      totalRatings > 0
        ? eventRatings.reduce((acc, curr) => acc + curr.rating, 0) /
          totalRatings
        : 0;

    await Event.update(
      {
        averageRating,
        totalRatings,
      },
      {
        where: { id: eventId },
      }
    );

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
    const ratings = await Rating.findAll({
      where: { eventId: req.params.eventId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
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
