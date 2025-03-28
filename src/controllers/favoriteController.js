const { Favorite, Event, Category } = require("../models");

const addFavorite = async (req, res) => {
  try {
    const { eventId } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      event: eventId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        status: "error",
        message: "Event already in favorites",
      });
    }

    // Add to favorites
    await Favorite.create({
      user: req.user._id,
      event: eventId,
    });

    res.status(201).json({
      status: "success",
      message: "Event added to favorites",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user._id,
      event: req.params.eventId,
    });

    if (!favorite) {
      return res.status(404).json({
        status: "error",
        message: "Favorite not found",
      });
    }

    await favorite.remove();

    res.json({
      status: "success",
      message: "Event removed from favorites",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: "event",
        populate: {
          path: "categories",
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      status: "success",
      data: { favorites },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
};
