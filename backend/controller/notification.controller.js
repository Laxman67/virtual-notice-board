import Notification from '../models/Notification.model.js';
import User from '../models/User.model.js';

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      unreadOnly = false,
      type
    } = req.query;

    const result = await Notification.getUserNotifications(req.user._id, {
      page: parseInt(page),
      limit: parseInt(limit),
      unreadOnly: unreadOnly === 'true',
      type
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: { notification }
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
};

// Clear all notifications
const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });

    res.status(200).json({
      success: true,
      message: 'All notifications cleared successfully'
    });
  } catch (error) {
    console.error('Clear all notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear all notifications'
    });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.getUnreadCount(req.user._id);

    res.status(200).json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
};

// Create notification (internal use)
const createNotification = async (notificationData) => {
  try {
    const { recipients, message, type, noticeId, sentBy } = notificationData;

    const notifications = recipients.map(recipient => ({
      recipient,
      message,
      type: type || 'info',
      noticeId,
      sentBy
    }));

    const savedNotifications = await Notification.insertMany(notifications);
    return savedNotifications;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

// Send notification to all users (admin only)
const sendNotificationToAll = async (req, res) => {
  try {
    const { message, type } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get all users
    const users = await User.find({}, '_id');
    const recipients = users.map(user => user._id);

    // Create notifications
    await createNotification({
      recipients,
      message,
      type: type || 'info',
      sentBy: req.user._id
    });

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('notification', {
        message,
        type: type || 'info',
        timestamp: new Date(),
        sentBy: req.user.name
      });
    }

    res.status(201).json({
      success: true,
      message: 'Notification sent to all users successfully'
    });
  } catch (error) {
    console.error('Send notification to all error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification to all users'
    });
  }
};

// Send notification to specific role (admin only)
const sendNotificationToRole = async (req, res) => {
  try {
    const { message, type, role } = req.body;

    if (!message || !role) {
      return res.status(400).json({
        success: false,
        message: 'Message and role are required'
      });
    }

    // Get users by role
    const users = await User.find({ role }, '_id');
    const recipients = users.map(user => user._id);

    if (recipients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found for this role'
      });
    }

    // Create notifications
    await createNotification({
      recipients,
      message,
      type: type || 'info',
      sentBy: req.user._id
    });

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(`role-${role}`).emit('notification', {
        message,
        type: type || 'info',
        timestamp: new Date(),
        sentBy: req.user.name
      });
    }

    res.status(201).json({
      success: true,
      message: `Notification sent to ${role}s successfully`
    });
  } catch (error) {
    console.error('Send notification to role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification to role'
    });
  }
};

export {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
  createNotification,
  sendNotificationToAll,
  sendNotificationToRole
};
