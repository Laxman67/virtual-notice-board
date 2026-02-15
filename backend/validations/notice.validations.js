
import { body, query } from 'express-validator';

// Validation rules
export const createNoticeValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .isIn(['Academic', 'Administrative', 'Events', 'Announcements'])
    .withMessage('Category must be Academic, Adminisstrative, Events, or Announcements'),
  body('targetAudience')
    .isArray({ min: 1 })
    .withMessage('At least one target audience is required'),
  body('targetAudience.*')
    .isIn(['ADMIN', 'FACULTY', 'STUDENT', 'ALL'])
    .withMessage('Target audience must be ADMIN, FACULTY, STUDENT, or ALL'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Priority must be LOW, MEDIUM, HIGH, or URGENT'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Valid expiration date is required'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot exceed 30 characters')
];

export const updateNoticeValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .optional()
    .isIn(['Academic', 'Administrative', 'Events', 'Announcements'])
    .withMessage('Category must be Academic, Administrative, Events, or Announcements'),
  body('targetAudience')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Target audience must be an array with at least one item'),
  body('targetAudience.*')
    .optional()
    .isIn(['ADMIN', 'FACULTY', 'STUDENT', 'ALL'])
    .withMessage('Target audience must be ADMIN, FACULTY, STUDENT, or ALL'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Priority must be LOW, MEDIUM, HIGH, or URGENT'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Valid expiration date is required'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('isPinned')
    .optional()
    .isBoolean()
    .withMessage('isPinned must be a boolean')
];

export const getNoticesValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('category')
    .optional()
    .isIn(['Academic', 'Administrative', 'Events', 'Announcements'])
    .withMessage('Category must be Academic, Administrative, Events, or Announcements'),
  query('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Priority must be LOW, MEDIUM, HIGH, or URGENT'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'priority', 'viewCount'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];
