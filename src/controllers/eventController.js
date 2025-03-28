const { Event, Category, User, Rating } = require("../models");

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
      creator: req.user._id,
      categories: categoryIds || [],
    });

    // Fetch event with populated fields
    const eventWithDetails = await Event.findById(event._id)
      .populate("categories")
      .populate("creator", "firstName lastName");

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

    const query = {};

    if (category) {
      const categoryDoc = await Category.findOne({ name: category });
      if (categoryDoc) {
        query.categories = categoryDoc._id;
      }
    }

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (startDate) query.startDate = { $gte: new Date(startDate) };
    if (endDate) query.endDate = { $lte: new Date(endDate) };

    const events = await Event.find(query)
      .populate("categories")
      .populate("creator", "firstName lastName")
      .sort({ startDate: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

    res.json({
      status: "success",
      data: {
        events,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
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
    const event = await Event.findById(req.params.id)
      .populate("categories")
      .populate("creator", "firstName lastName");

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
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    // Check if user is the creator or admin
    if (!event.creator.equals(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this event",
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, categories: req.body.categoryIds },
      { new: true, runValidators: true }
    ).populate("categories");

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
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    // Check if user is the creator or admin
    if (!event.creator.equals(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this event",
      });
    }

    await event.remove();

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

    const events = await Event.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      },
    })
      .populate("categories")
      .populate("creator", "firstName lastName");

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
