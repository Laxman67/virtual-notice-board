// routes/user.routes.js
import express from 'express';
import { body, query } from 'express-validator';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
} from '../controller/user.controller.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { isAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

// All routes are admin-only
router.use(authenticateToken);
router.use(isAdmin);

// Validation rules
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['ADMIN', 'FACULTY', 'STUDENT'])
    .withMessage('Role must be ADMIN, FACULTY, or STUDENT'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department cannot exceed 100 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

const getAllUsersValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('role')
    .optional()
    .isIn(['ADMIN', 'FACULTY', 'STUDENT'])
    .withMessage('Role must be ADMIN, FACULTY, or STUDENT'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'name', 'email', 'role'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

// GET /api/users/stats - Get user statistics
router.get('/stats', getUserStats);

// GET /api/users - Get all users with filtering and pagination
router.get('/', getAllUsersValidation, getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// PUT /api/users/:id - Update user
router.put('/:id', updateUserValidation, updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', deleteUser);

export default router;
