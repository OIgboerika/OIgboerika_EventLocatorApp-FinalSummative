const { Rating, Event, User } = require("../models");

const createRating = async (req, res) => {
  try {
    const { eventId, rating, review } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    // Check if user has already rated this event
    const existingRating = await Rating.findOne({
      user: req.user._id,
      event: eventId,
    });

    if (existingRating) {
      return res.status(400).json({
        status: "error",
        message: "You have already rated this event",
      });
    }

    // Create rating
    const newRating = await Rating.create({
      user: req.user._id,
      event: eventId,
      rating,
      review,
    });

    // Update event's average rating and total ratings
    await event.updateRating(rating);

    // Fetch rating with user details
    const ratingWithUser = await Rating.findById(newRating._id).populate(
      "user",
      "firstName lastName"
    );

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

    const existingRating = await Rating.findById(ratingId);
    if (!existingRating) {
      return res.status(404).json({
        status: "error",
        message: "Rating not found",
      });
    }

    // Check if user owns this rating
    if (!existingRating.user.equals(req.user._id)) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this rating",
      });
    }

    // Update rating
    existingRating.rating = rating;
    existingRating.review = review;
    await existingRating.save();

    // Update event's average rating
    const event = await Event.findById(existingRating.event);
    if (event) {
      // Recalculate average rating
      const ratings = await Rating.find({ event: event._id });
      const totalRatings = ratings.length;
      const averageRating =
        ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings;

      event.averageRating = averageRating;
      event.totalRatings = totalRatings;
      await event.save();
    }

    // Fetch updated rating with user details
    const updatedRating = await Rating.findById(ratingId).populate(
      "user",
      "firstName lastName"
    );

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

    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({
        status: "error",
        message: "Rating not found",
      });
    }

    // Check if user owns this rating
    if (!rating.user.equals(req.user._id)) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this rating",
      });
    }

    // Store event ID before deleting rating
    const eventId = rating.event;

    // Delete rating
    await rating.remove();

    // Update event's average rating
    const event = await Event.findById(eventId);
    if (event) {
      // Recalculate average rating
      const ratings = await Rating.find({ event: eventId });
      const totalRatings = ratings.length;
      const averageRating =
        totalRatings > 0
          ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings
          : 0;

      event.averageRating = averageRating;
      event.totalRatings = totalRatings;
      await event.save();
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

    const ratings = await Rating.find({ event: eventId })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 });

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
