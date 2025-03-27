const passport = require("passport");
const { User } = require("../models");

const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: info.message || "Authentication failed",
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  })(req, res, next);
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      status: "error",
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

module.exports = {
  authenticate,
  isAdmin,
};
