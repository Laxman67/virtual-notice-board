// routes/notice.routes.js
import express from 'express';
import {
  createNotice,
  getNotices,
  getNotice,
  updateNotice,
  deleteNotice,
  getNoticeStats
} from '../controller/notice.controller.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { isFaculty, isAdmin } from '../middleware/role.middleware.js';
import {
  createNoticeValidation,
  getNoticesValidation,
  updateNoticeValidation
} from '../validations/notice.validations.js';

const router = express.Router();


// All routes are protected
router.use(authenticateToken);

// GET /api/notices/stats - Get notice statistics (admin only)
router.get('/stats', isAdmin, getNoticeStats);

// GET /api/notices - Get all notices with filtering and pagination
router.get('/', getNoticesValidation, getNotices);

// GET /api/notices/:id - Get single notice
router.get('/:id', getNotice);

// POST /api/notices - Create new notice (faculty and admin only)
router.post('/', isFaculty, createNoticeValidation, createNotice);

// PUT /api/notices/:id - Update notice
router.put('/:id', updateNoticeValidation, updateNotice);

// DELETE /api/notices/:id - Delete notice
router.delete('/:id', deleteNotice);

export default router;
