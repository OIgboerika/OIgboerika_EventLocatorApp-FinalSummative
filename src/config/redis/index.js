const Redis = require('redis');
const config = require('./config');

const redisClient = Redis.createClient({
  host: config.host,
  port: config.port,
  password: config.password
});

const setupRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis connection established successfully.');
    
    // Subscribe to notification channel
    await redisClient.subscribe('notifications', (message) => {
      console.log('Received notification:', message);
      // Handle notification (e.g., send email, push notification)
      handleNotification(JSON.parse(message));
    });
  } catch (error) {
    console.error('Unable to connect to Redis:', error);
    process.exit(1);
  }
};

const handleNotification = async (notification) => {
  // Implement notification handling logic here
  // This could include sending emails, push notifications, etc.
  console.log('Processing notification:', notification);
};

module.exports = {
  redisClient,
  setupRedis
}; 