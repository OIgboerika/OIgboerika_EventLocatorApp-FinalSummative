const redis = require("../config/redis");
const { v4: uuidv4 } = require("uuid");

class NotificationService {
  constructor() {
    this.redis = redis;
    this.notificationPrefix = "notification:";
    this.userNotificationPrefix = "user:notifications:";
    this.notificationExpiry = 30 * 24 * 60 * 60; // 30 days in seconds
  }

  async createNotification(userId, type, data) {
    const notificationId = uuidv4();
    const notification = {
      id: notificationId,
      userId,
      type,
      data,
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Store notification
    await this.redis.set(
      `${this.notificationPrefix}${notificationId}`,
      JSON.stringify(notification),
      "EX",
      this.notificationExpiry
    );

    // Add to user's notification list
    await this.redis.lpush(
      `${this.userNotificationPrefix}${userId}`,
      notificationId
    );

    // Trim user's notification list to keep only the last 100 notifications
    await this.redis.ltrim(`${this.userNotificationPrefix}${userId}`, 0, 99);

    return notification;
  }

  async getUserNotifications(userId, page = 1, limit = 20) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Get notification IDs
    const notificationIds = await this.redis.lrange(
      `${this.userNotificationPrefix}${userId}`,
      start,
      end
    );

    // Get notification details
    const notifications = await Promise.all(
      notificationIds.map(async (id) => {
        const notification = await this.redis.get(
          `${this.notificationPrefix}${id}`
        );
        return notification ? JSON.parse(notification) : null;
      })
    );

    // Filter out any null values and get total count
    const validNotifications = notifications.filter((n) => n !== null);
    const total = await this.redis.llen(
      `${this.userNotificationPrefix}${userId}`
    );

    return {
      notifications: validNotifications,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async markAsRead(userId, notificationId) {
    const notification = await this.redis.get(
      `${this.notificationPrefix}${notificationId}`
    );
    if (!notification) {
      throw new Error("Notification not found");
    }

    const parsedNotification = JSON.parse(notification);
    if (parsedNotification.userId !== userId) {
      throw new Error("Unauthorized");
    }

    parsedNotification.read = true;
    await this.redis.set(
      `${this.notificationPrefix}${notificationId}`,
      JSON.stringify(parsedNotification),
      "EX",
      this.notificationExpiry
    );

    return parsedNotification;
  }

  async markAllAsRead(userId) {
    const notificationIds = await this.redis.lrange(
      `${this.userNotificationPrefix}${userId}`,
      0,
      -1
    );

    await Promise.all(
      notificationIds.map(async (id) => {
        const notification = await this.redis.get(
          `${this.notificationPrefix}${id}`
        );
        if (notification) {
          const parsedNotification = JSON.parse(notification);
          parsedNotification.read = true;
          await this.redis.set(
            `${this.notificationPrefix}${id}`,
            JSON.stringify(parsedNotification),
            "EX",
            this.notificationExpiry
          );
        }
      })
    );

    return { message: "All notifications marked as read" };
  }

  async deleteNotification(userId, notificationId) {
    const notification = await this.redis.get(
      `${this.notificationPrefix}${notificationId}`
    );
    if (!notification) {
      throw new Error("Notification not found");
    }

    const parsedNotification = JSON.parse(notification);
    if (parsedNotification.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await this.redis.del(`${this.notificationPrefix}${notificationId}`);
    await this.redis.lrem(
      `${this.userNotificationPrefix}${userId}`,
      0,
      notificationId
    );

    return { message: "Notification deleted successfully" };
  }

  async getUnreadCount(userId) {
    const notificationIds = await this.redis.lrange(
      `${this.userNotificationPrefix}${userId}`,
      0,
      -1
    );

    let unreadCount = 0;
    await Promise.all(
      notificationIds.map(async (id) => {
        const notification = await this.redis.get(
          `${this.notificationPrefix}${id}`
        );
        if (notification) {
          const parsedNotification = JSON.parse(notification);
          if (!parsedNotification.read) {
            unreadCount++;
          }
        }
      })
    );

    return unreadCount;
  }
}

module.exports = new NotificationService();
