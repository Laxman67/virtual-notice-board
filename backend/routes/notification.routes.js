import express from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
  sendNotificationToAll,
  sendNotificationToRole
} from '../controller/notification.controller.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

// All notification routes require authentication
router.use(authenticateToken);

// User notification routes
router.get('/', getUserNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/:id/read', markNotificationAsRead);
router.patch('/read-all', markAllNotificationsAsRead);
router.delete('/:id', deleteNotification);
router.delete('/', clearAllNotifications);

// Admin notification routes
router.post('/send-all', authorizeRoles(['ADMIN']), sendNotificationToAll);
router.post('/send-role', authorizeRoles(['ADMIN']), sendNotificationToRole);

export default router;
