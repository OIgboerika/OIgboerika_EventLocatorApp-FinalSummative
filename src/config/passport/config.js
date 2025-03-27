module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h'
}; 