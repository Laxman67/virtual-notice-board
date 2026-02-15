import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  noticeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notice'
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, read: 1 });

// Method to mark notification as read
notificationSchema.methods.markAsRead = function () {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function (userId) {
  return await this.countDocuments({
    recipient: userId,
    read: false
  });
};

// Static method to get user notifications
notificationSchema.statics.getUserNotifications = async function (userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    unreadOnly = false,
    type
  } = options;

  const query = { recipient: userId };

  if (unreadOnly) {
    query.read = false;
  }

  if (type) {
    query.type = type;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const notifications = await this.find(query)
    .populate('sentBy', 'name email role')
    .populate('noticeId', 'title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await this.countDocuments(query);
  const unread = await this.getUnreadCount(userId);

  return {
    notifications,
    pagination: {
      current: parseInt(page),
      pageSize: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    },
    unreadCount: unread
  };
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
