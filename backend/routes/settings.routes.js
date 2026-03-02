// routes/settings.routes.js
import express from 'express';
import { body } from 'express-validator';
import {
  getSettings,
  getSettingsByCategory,
  updateSettings,
  resetSettings,
  exportSettings,
  importSettings
} from '../controller/settings.controller.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { isAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

// All routes are admin-only
router.use(authenticateToken);
router.use(isAdmin);

// Validation rules
const updateSettingsValidation = [
  body('*.siteName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Site name must be between 2 and 100 characters'),
  body('*.siteDescription')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Site description cannot exceed 500 characters'),
  body('*.adminEmail')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid admin email'),
  body('*.supportEmail')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid support email'),
  body('*.timezone')
    .optional()
    .isIn(['UTC', 'EST', 'PST', 'IST'])
    .withMessage('Invalid timezone'),
  body('*.language')
    .optional()
    .isIn(['en', 'es', 'fr', 'de'])
    .withMessage('Invalid language'),
  body('*.passwordMinLength')
    .optional()
    .isInt({ min: 6, max: 20 })
    .withMessage('Password length must be between 6 and 20'),
  body('*.sessionTimeout')
    .optional()
    .isInt({ min: 5, max: 1440 })
    .withMessage('Session timeout must be between 5 and 1440 minutes'),
  body('*.maxFileSize')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Max file size must be between 1 and 100 MB'),
  body('*.maxUsersPerDepartment')
    .optional()
    .isInt({ min: 10, max: 10000 })
    .withMessage('Max users per department must be between 10 and 10000')
];

const importSettingsValidation = [
  body('settingsData')
    .notEmpty()
    .withMessage('Settings data is required')
    .isObject()
    .withMessage('Settings data must be an object')
];

// GET /api/settings - Get all settings
router.get('/', getSettings);

// GET /api/settings/:category - Get settings by category
router.get('/:category', getSettingsByCategory);

// PUT /api/settings/:category - Update settings by category
router.put('/:category', updateSettingsValidation, updateSettings);

// POST /api/settings/:category/reset - Reset settings to defaults
router.post('/:category/reset', resetSettings);

// GET /api/settings/export - Export all settings
router.get('/export/all', exportSettings);

// POST /api/settings/import - Import settings
router.post('/import', importSettingsValidation, importSettings);

export default router;
