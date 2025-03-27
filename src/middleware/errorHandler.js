const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // JWT authentication error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }

  // JWT token expired
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expired'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
};

module.exports = {
  errorHandler
}; 