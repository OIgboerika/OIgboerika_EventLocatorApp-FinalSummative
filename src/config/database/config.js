module.exports = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'event_locator',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  logging: process.env.NODE_ENV === 'development' ? console.log : false
}; 