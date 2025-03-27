const { Event, Category, User, Rating } = require("../models");
const { Op } = require("sequelize");

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      address,
      startDate,
      endDate,
      capacity,
      price,
      imageUrl,
      categoryIds,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      location,
      address,
      startDate,
      endDate,
      capacity,
      price,
      imageUrl,
      creatorId: req.user.id,
    });

    // Add categories if provided
    if (categoryIds && categoryIds.length > 0) {
      await event.setCategories(categoryIds);
    }

    // Fetch event with categories
    const eventWithCategories = await Event.findByPk(event.id, {
      include: [
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
      ],
    });

    res.status(201).json({
      status: "success",
      data: { event: eventWithCategories },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      status,
      startDate,
      endDate,
    } = req.query;

    const where = {};
    if (category) where["$categories.name$"] = category;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (startDate) where.startDate = { [Op.gte]: startDate };
    if (endDate) where.endDate = { [Op.lte]: endDate };

    const events = await Event.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [["startDate", "ASC"]],
    });

    res.json({
      status: "success",
      data: {
        events: events.rows,
        total: events.count,
        pages: Math.ceil(events.count / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Rating,
          as: "ratings",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    res.json({
      status: "success",
      data: { event },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    // Check if user is creator or admin
    if (event.creatorId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this event",
      });
    }

    const {
      title,
      description,
      location,
      address,
      startDate,
      endDate,
      capacity,
      price,
      imageUrl,
      status,
      categoryIds,
    } = req.body;

    await event.update({
      title,
      description,
      location,
      address,
      startDate,
      endDate,
      capacity,
      price,
      imageUrl,
      status,
    });

    // Update categories if provided
    if (categoryIds) {
      await event.setCategories(categoryIds);
    }

    // Fetch updated event with categories
    const updatedEvent = await Event.findByPk(event.id, {
      include: [
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
      ],
    });

    res.json({
      status: "success",
      data: { event: updatedEvent },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    // Check if user is creator or admin
    if (event.creatorId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this event",
      });
    }

    await event.destroy();

    res.json({
      status: "success",
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const searchNearbyEvents = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    const radiusInMeters = radius * 1000; // Convert km to meters

    const events = await Event.findAll({
      where: {
        location: {
          [Op.dwithin]: {
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
            distance: radiusInMeters,
          },
        },
      },
      include: [
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["startDate", "ASC"]],
    });

    res.json({
      status: "success",
      data: { events },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  searchNearbyEvents,
};
