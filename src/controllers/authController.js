const jwt = require("jsonwebtoken");
const { User } = require("../models");
const config = require("../config/passport/config");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

const register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      location,
      preferredCategories,
      preferredLanguage,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already registered",
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      location,
      preferredCategories,
      preferredLanguage,
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          location: user.location,
          preferredCategories: user.preferredCategories,
          preferredLanguage: user.preferredLanguage,
        },
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      status: "success",
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          location: user.location,
          preferredCategories: user.preferredCategories,
          preferredLanguage: user.preferredLanguage,
        },
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      location,
      preferredCategories,
      preferredLanguage,
    } = req.body;
    const user = await User.findByPk(req.user.id);

    await user.update({
      firstName,
      lastName,
      location,
      preferredCategories,
      preferredLanguage,
    });

    res.json({
      status: "success",
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          location: user.location,
          preferredCategories: user.preferredCategories,
          preferredLanguage: user.preferredLanguage,
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

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
