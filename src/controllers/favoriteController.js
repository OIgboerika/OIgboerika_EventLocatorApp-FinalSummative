const { Favorite, Event } = require("../models");

const addFavorite = async (req, res) => {
  try {
    const { eventId } = req.body;

    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      where: {
        userId: req.user.id,
        eventId,
      },
    });

    if (existingFavorite) {
      return res.status(400).json({
        status: "error",
        message: "Event already in favorites",
      });
    }

    // Add to favorites
    const favorite = await Favorite.create({
      userId: req.user.id,
      eventId,
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
      where: {
        userId: req.user.id,
        eventId: req.params.eventId,
      },
    });

    if (!favorite) {
      return res.status(404).json({
        status: "error",
        message: "Favorite not found",
      });
    }

    await favorite.destroy();

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
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Event,
          as: "event",
          include: [
            {
              model: Category,
              as: "categories",
              through: { attributes: [] },
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      status: "success",
      data: {
        favorites: favorites.map((fav) => fav.event),
      },
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
