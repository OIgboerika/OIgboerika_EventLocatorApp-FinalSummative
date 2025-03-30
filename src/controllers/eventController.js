const { Event, Category, User, Rating } = require("../models");
const { Op } = require("sequelize");

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      address,
      date,
      category,
      price,
      capacity,
      imageUrl,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      location,
      address,
      date,
      category,
      price,
      capacity,
      imageUrl,
      organizer: req.user.id,
    });

    // Fetch event with organizer details
    const eventWithDetails = await Event.findByPk(event.id, {
      include: [
        {
          model: User,
          as: "organizer",
          attributes: ["firstName", "lastName"],
        },
      ],
    });

    res.status(201).json({
      status: "success",
      data: { event: eventWithDetails },
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

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (startDate) {
      where.date = { [Op.gte]: new Date(startDate) };
    }

    if (endDate) {
      where.date = { ...where.date, [Op.lte]: new Date(endDate) };
    }

    const { count, rows: events } = await Event.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "organizer",
          attributes: ["firstName", "lastName"],
        },
      ],
      order: [["date", "ASC"]],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    res.json({
      status: "success",
      data: {
        events,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
        },
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
          model: User,
          as: "organizer",
          attributes: ["firstName", "lastName"],
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

    // Check if user is the organizer or admin
    if (event.organizer !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this event",
      });
    }

    await event.update(req.body);

    // Fetch updated event with organizer details
    const updatedEvent = await Event.findByPk(event.id, {
      include: [
        {
          model: User,
          as: "organizer",
          attributes: ["firstName", "lastName"],
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

    // Check if user is the organizer or admin
    if (event.organizer !== req.user.id && !req.user.isAdmin) {
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

    // Since we're using JSONB for location, we'll do a simple distance calculation
    const events = await Event.findAll({
      where: {
        location: {
          [Op.and]: [
            {
              latitude: {
                [Op.between]: [
                  parseFloat(latitude) - radius,
                  parseFloat(latitude) + radius,
                ],
              },
            },
            {
              longitude: {
                [Op.between]: [
                  parseFloat(longitude) - radius,
                  parseFloat(longitude) + radius,
                ],
              },
            },
          ],
        },
      },
      include: [
        {
          model: User,
          as: "organizer",
          attributes: ["firstName", "lastName"],
        },
      ],
    });

    // Filter events by actual distance (since we're using a bounding box)
    const filteredEvents = events.filter((event) => {
      const eventLoc = event.location;
      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        eventLoc.latitude,
        eventLoc.longitude
      );
      return distance <= radius;
    });

    res.json({
      status: "success",
      data: { events: filteredEvents },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  searchNearbyEvents,
};
