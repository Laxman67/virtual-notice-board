// sockets/handlers/notice.handler.js
import { addOnlineUser, removeOnlineUserBySocket, getSocketIdByUser } from '../socketManager.js';
import jwt from 'jsonwebtoken';
import { createNotification } from '../../controller/notification.controller.js';
import User from '../../models/User.model.js';

export default function registerNoticeHandlers(io, socket) {
  // Authenticate socket connection
  const authenticateSocket = async (token) => {
    try {

      if (!token) {
        throw new Error('No token provided');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      console.error('Socket authentication error:', error);
      return null;
    }
  };

  // Get recipients based on target audience
  const getRecipients = async (targetAudience) => {
    if (targetAudience === 'ALL' || targetAudience.includes('ALL')) {
      const users = await User.find({}, '_id');
      return users.map(user => user._id);
    } else {
      const users = await User.find({ role: { $in: targetAudience } }, '_id');
      return users.map(user => user._id);
    }
  };

  // Handle user joining their role-specific room
  socket.on('join-notice-room', async (data) => {
    const { token, userRole } = data;

    const user = await authenticateSocket(token);
    if (!user) {
      socket.emit('error', { message: 'Authentication failed' });
      return;
    }

    // Join role-based room
    socket.join(`role-${userRole}`);

    // Join personal room for direct notifications
    socket.join(`user-${user.id}`);

    // Add to online users
    addOnlineUser(user.id, socket.id);

    console.log(`🔌 User ${user?.name} (${user.id}) joined room: role-${userRole}`);
  });

  // Handle real-time notice creation
  socket.on('create-notice', async (data) => {
    const { token, noticeData } = data;

    const user = await authenticateSocket(token);
    if (!user) {
      socket.emit('error', { message: 'Authentication failed' });
      return;
    }

    const { targetAudience, title, description, category, postedBy } = noticeData;

    try {
      // Get recipients for persistent notifications
      const recipients = await getRecipients(targetAudience);

      // Create persistent notifications
      await createNotification({
        recipients,
        message: `New notice: ${title}`,
        type: noticeData.priority === 'HIGH' ? 'warning' : 'info',
        noticeId: noticeData._id,
        sentBy: user.id
      });

      // Broadcast to target audience rooms
      if (targetAudience === 'ALL' || targetAudience.includes('ALL')) {
        io.emit('new-notice', noticeData);

        // Send real-time notification
        io.emit('notification', {
          message: `New notice: ${title}`,
          type: noticeData.priority === 'HIGH' ? 'warning' : 'info',
          timestamp: new Date(),
          noticeId: noticeData._id
        });
      } else {
        targetAudience.forEach(role => {
          io.to(`role-${role}`).emit('new-notice', noticeData);
          io.to(`role-${role}`).emit('notification', {
            message: `New notice: ${title}`,
            type: noticeData.priority === 'HIGH' ? 'warning' : 'info',
            timestamp: new Date(),
            noticeId: noticeData._id
          });
        });
      }

      console.log(`📢 New notice broadcast: ${title} by ${user.name}`);
    } catch (error) {
      console.error('Error creating notice notifications:', error);
      socket.emit('error', { message: 'Failed to create notifications' });
    }
  });

  // Handle notice updates
  socket.on('update-notice', async (data) => {
    const { token, noticeData } = data;

    const user = await authenticateSocket(token);
    if (!user) {
      socket.emit('error', { message: 'Authentication failed' });
      return;
    }

    const { targetAudience, noticeId, title } = noticeData;

    try {
      // Get recipients for persistent notifications
      const recipients = await getRecipients(targetAudience);

      // Create persistent notifications
      await createNotification({
        recipients,
        message: `Notice updated: ${title}`,
        type: 'info',
        noticeId: noticeId,
        sentBy: user.id
      });

      // Broadcast to target audience rooms
      if (targetAudience === 'ALL' || targetAudience.includes('ALL')) {
        io.emit('notice-updated', noticeData);
        io.emit('notification', {
          message: `Notice updated: ${title}`,
          type: 'info',
          timestamp: new Date(),
          noticeId
        });
      } else {
        targetAudience.forEach(role => {
          io.to(`role-${role}`).emit('notice-updated', noticeData);
          io.to(`role-${role}`).emit('notification', {
            message: `Notice updated: ${title}`,
            type: 'info',
            timestamp: new Date(),
            noticeId
          });
        });
      }

      console.log(`📝 Notice updated: ${noticeId} by ${user.name}`);
    } catch (error) {
      console.error('Error updating notice notifications:', error);
      socket.emit('error', { message: 'Failed to update notifications' });
    }
  });

  // Handle notice deletion
  socket.on('delete-notice', async (data) => {
    const { token, noticeData } = data;

    const user = await authenticateSocket(token);
    if (!user) {
      socket.emit('error', { message: 'Authentication failed' });
      return;
    }

    const { targetAudience, noticeId, title } = noticeData;

    try {
      // Get recipients for persistent notifications
      const recipients = await getRecipients(targetAudience);

      // Create persistent notifications
      await createNotification({
        recipients,
        message: `Notice deleted: ${title}`,
        type: 'info',
        noticeId: noticeId,
        sentBy: user.id
      });

      // Broadcast to target audience rooms
      if (targetAudience === 'ALL' || targetAudience.includes('ALL')) {
        io.emit('notice-deleted', { noticeId, title });
        io.emit('notification', {
          message: `Notice deleted: ${title}`,
          type: 'info',
          timestamp: new Date(),
          noticeId
        });
      } else {
        targetAudience.forEach(role => {
          io.to(`role-${role}`).emit('notice-deleted', { noticeId, title });
          io.to(`role-${role}`).emit('notification', {
            message: `Notice deleted: ${title}`,
            type: 'info',
            timestamp: new Date(),
            noticeId
          });
        });
      }

      console.log(`🗑️ Notice deleted: ${noticeId} by ${user.name}`);
    } catch (error) {
      console.error('Error deleting notice notifications:', error);
      socket.emit('error', { message: 'Failed to delete notifications' });
    }
  });

  // Handle notice view tracking (for analytics)
  socket.on('view-notice', async (data) => {
    const { token, noticeId, userId } = data;

    const user = await authenticateSocket(token);
    if (!user) {
      socket.emit('error', { message: 'Authentication failed' });
      return;
    }

    // Emit to admin room for analytics
    io.to('role-ADMIN').emit('notice-viewed', {
      noticeId,
      userId: user.id,
      timestamp: new Date()
    });
  });

  // Handle real-time notifications (admin only)
  socket.on('send-notification', async (data) => {
    const { token, notificationData } = data;

    const user = await authenticateSocket(token);
    if (!user || user.role !== 'ADMIN') {
      socket.emit('error', { message: 'Admin access required' });
      return;
    }

    const { targetUsers, message, type } = notificationData;

    try {
      let recipients = [];

      if (targetUsers === 'ALL') {
        const users = await User.find({}, '_id');
        recipients = users.map(user => user._id);

        io.emit('notification', {
          message,
          type: type || 'info',
          timestamp: new Date(),
          sentBy: user.name
        });
      } else if (Array.isArray(targetUsers)) {
        recipients = targetUsers;

        targetUsers.forEach(userId => {
          const socketId = getSocketIdByUser(userId);
          if (socketId) {
            io.to(socketId).emit('notification', {
              message,
              type: type || 'info',
              timestamp: new Date(),
              sentBy: user.name
            });
          }
        });
      } else {
        // Handle role-based targeting
        const users = await User.find({ role: targetUsers }, '_id');
        recipients = users.map(user => user._id);

        io.to(`role-${targetUsers}`).emit('notification', {
          message,
          type: type || 'info',
          timestamp: new Date(),
          sentBy: user.name
        });
      }

      // Create persistent notifications
      if (recipients.length > 0) {
        await createNotification({
          recipients,
          message,
          type: type || 'info',
          sentBy: user.id
        });
      }

      console.log(`📢 Notification sent by ${user.name}: ${message}`);
    } catch (error) {
      console.error('Error sending notification:', error);
      socket.emit('error', { message: 'Failed to send notification' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const userId = removeOnlineUserBySocket(socket.id);
    if (userId) {
      console.log(`❌ User ${userId} disconnected`);
    }
  });
}
