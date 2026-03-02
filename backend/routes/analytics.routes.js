// routes/analytics.routes.js
import express from 'express';
import { query } from 'express-validator';
import {
  getAnalytics,
  getUserAnalytics,
  getNoticeAnalytics
} from '../controller/analytics.controller.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { isAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

// All routes are admin-only
router.use(authenticateToken);
router.use(isAdmin);

// Validation rules
const dateRangeValidation = [
  query('dateRange')
    .optional()
    .isIn(['24h', '7d', '30d', '90d', '1y'])
    .withMessage('Date range must be 24h, 7d, 30d, 90d, or 1y')
];

// GET /api/analytics - Get comprehensive analytics
router.get('/', dateRangeValidation, getAnalytics);

// GET /api/analytics/users - Get user analytics
router.get('/users', dateRangeValidation, getUserAnalytics);

// GET /api/analytics/notices - Get notice analytics
router.get('/notices', dateRangeValidation, getNoticeAnalytics);

export default router;
