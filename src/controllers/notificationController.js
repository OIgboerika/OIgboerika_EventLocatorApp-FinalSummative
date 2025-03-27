const notificationService = require("../services/notificationService");

const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await notificationService.getUserNotifications(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await notificationService.markAsRead(
      req.user.id,
      notificationId
    );
    res.json(notification);
  } catch (error) {
    if (error.message === "Notification not found") {
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }
    if (error.message === "Unauthorized") {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized to mark this notification as read",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const result = await notificationService.deleteNotification(
      req.user.id,
      notificationId
    );
    res.json(result);
  } catch (error) {
    if (error.message === "Notification not found") {
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }
    if (error.message === "Unauthorized") {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized to delete this notification",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to get unread notification count",
      error: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
