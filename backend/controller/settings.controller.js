// controller/settings.controller.js
import { validationResult } from 'express-validator';

// Mock settings storage (in production, this would be in a database)
let settings = {
  general: {
    siteName: 'Virtual Notice Board',
    siteDescription: 'Centralized notice management system',
    adminEmail: 'admin@vnb.edu',
    supportEmail: 'support@vnb.edu',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  },
  security: {
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumber: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorAuth: false,
    forcePasswordChange: false
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newNoticeAlert: true,
    systemUpdates: true,
    securityAlerts: true,
    digestFrequency: 'daily'
  },
  appearance: {
    theme: 'light',
    primaryColor: '#8B5CF6',
    accentColor: '#EC4899',
    logoUrl: '',
    faviconUrl: '',
    customCSS: '',
    animationsEnabled: true
  },
  system: {
    maxFileSize: 10,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png', 'jpeg'],
    autoCleanup: true,
    cleanupDays: 365,
    backupEnabled: true,
    backupFrequency: 'daily',
    maintenanceMode: false,
    debugMode: false
  },
  users: {
    allowRegistration: true,
    requireEmailVerification: true,
    defaultUserRole: 'STUDENT',
    maxUsersPerDepartment: 500,
    allowProfileEdit: true,
    allowPasswordChange: true
  }
};

// Get all settings (admin only)
const getSettings = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
};

// Get settings by category (admin only)
const getSettingsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!settings[category]) {
      return res.status(404).json({
        success: false,
        message: 'Settings category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: settings[category]
    });
  } catch (error) {
    console.error('Get settings by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
};

// Update settings (admin only)
const updateSettings = async (req, res) => {
  try {
    const { category } = req.params;
    const updates = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (!settings[category]) {
      return res.status(404).json({
        success: false,
        message: 'Settings category not found'
      });
    }

    // Update settings
    settings[category] = { ...settings[category], ...updates };

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings[category]
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
};

// Reset settings to defaults (admin only)
const resetSettings = async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!settings[category]) {
      return res.status(404).json({
        success: false,
        message: 'Settings category not found'
      });
    }

    // Reset to defaults (in production, these would come from a config file)
    const defaultSettings = {
      general: {
        siteName: 'Virtual Notice Board',
        siteDescription: 'Centralized notice management system',
        adminEmail: 'admin@vnb.edu',
        supportEmail: 'support@vnb.edu',
        timezone: 'UTC',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
      },
      security: {
        passwordMinLength: 8,
        passwordRequireSpecial: true,
        passwordRequireNumber: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        lockoutDuration: 15,
        twoFactorAuth: false,
        forcePasswordChange: false
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        newNoticeAlert: true,
        systemUpdates: true,
        securityAlerts: true,
        digestFrequency: 'daily'
      },
      appearance: {
        theme: 'light',
        primaryColor: '#8B5CF6',
        accentColor: '#EC4899',
        logoUrl: '',
        faviconUrl: '',
        customCSS: '',
        animationsEnabled: true
      },
      system: {
        maxFileSize: 10,
        allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png', 'jpeg'],
        autoCleanup: true,
        cleanupDays: 365,
        backupEnabled: true,
        backupFrequency: 'daily',
        maintenanceMode: false,
        debugMode: false
      },
      users: {
        allowRegistration: true,
        requireEmailVerification: true,
        defaultUserRole: 'STUDENT',
        maxUsersPerDepartment: 500,
        allowProfileEdit: true,
        allowPasswordChange: true
      }
    };

    settings[category] = defaultSettings[category];

    res.status(200).json({
      success: true,
      message: 'Settings reset to defaults successfully',
      data: settings[category]
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset settings'
    });
  }
};

// Export settings (admin only)
const exportSettings = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: settings,
      filename: `settings-backup-${new Date().toISOString().split('T')[0]}.json`
    });
  } catch (error) {
    console.error('Export settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export settings'
    });
  }
};

// Import settings (admin only)
const importSettings = async (req, res) => {
  try {
    const { settingsData } = req.body;

    if (!settingsData || typeof settingsData !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid settings data'
      });
    }

    // Validate and merge settings
    const validCategories = ['general', 'security', 'notifications', 'appearance', 'system', 'users'];
    
    for (const category of Object.keys(settingsData)) {
      if (validCategories.includes(category) && typeof settingsData[category] === 'object') {
        settings[category] = { ...settings[category], ...settingsData[category] };
      }
    }

    res.status(200).json({
      success: true,
      message: 'Settings imported successfully',
      data: settings
    });
  } catch (error) {
    console.error('Import settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import settings'
    });
  }
};

export {
  getSettings,
  getSettingsByCategory,
  updateSettings,
  resetSettings,
  exportSettings,
  importSettings
};
