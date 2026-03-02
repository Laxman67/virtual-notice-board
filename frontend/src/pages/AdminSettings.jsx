import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { settingsAPI } from '../api/admin'
import {
  Settings,
  Shield,
  Bell,
  Database,
  Mail,
  Lock,
  Globe,
  Palette,
  Users,
  FileText,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Info,
  Smartphone,
  Monitor,
  Zap,
  Clock,
  Archive,
  Trash2,
  Download,
  Upload
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const AdminSettings = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
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
  })

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: Database },
    { id: 'users', label: 'Users', icon: Users }
  ]

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getSettings()
      setSettings(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch settings')
      console.error('Error fetching settings:', error)
    }
  }

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }))
  }

  const handleSaveSettings = async (category) => {
    try {
      setLoading(true)
      await settingsAPI.updateSettings(category, settings[category])
      toast.success(`${category.charAt(0).toUpperCase() + category.slice(1)} settings saved successfully`)
    } catch (error) {
      toast.error('Failed to save settings')
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResetSettings = async (category) => {
    if (window.confirm(`Are you sure you want to reset ${category} settings to defaults?`)) {
      try {
        await settingsAPI.resetSettings(category)
        await fetchSettings() // Refresh settings after reset
        toast.success(`${category} settings reset to defaults`)
      } catch (error) {
        toast.error('Failed to reset settings')
        console.error('Error resetting settings:', error)
      }
    }
  }

  const handleExportSettings = async () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
      const exportFileDefaultName = 'settings-backup.json'
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
      toast.success('Settings exported successfully')
    } catch (error) {
      toast.error('Failed to export settings')
    }
  }

  const handleImportSettings = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        const text = await file.text()
        const importedSettings = JSON.parse(text)
        await settingsAPI.importSettings(importedSettings)
        await fetchSettings() // Refresh settings after import
        toast.success('Settings imported successfully')
      } catch (error) {
        toast.error('Invalid settings file or import failed')
        console.error('Error importing settings:', error)
      }
    }
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access system settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  System Settings
                </h1>
                <p className="text-gray-600">Configure system parameters and preferences</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportSettings}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <label className="flex items-center space-x-2 px-4 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Settings Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-2">
          <div className="flex flex-wrap space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                    : 'text-gray-600 hover:bg-purple-50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleResetSettings('general')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={() => handleSaveSettings('general')}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                  <input
                    type="text"
                    value={settings.general.siteDescription}
                    onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                  <input
                    type="email"
                    value={settings.general.adminEmail}
                    onChange={(e) => handleSettingChange('general', 'adminEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                  <input
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => handleSettingChange('general', 'supportEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">EST</option>
                    <option value="PST">PST</option>
                    <option value="IST">IST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleResetSettings('security')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={() => handleSaveSettings('security')}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Password Length</label>
                  <input
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lockout Duration (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.lockoutDuration}
                    onChange={(e) => handleSettingChange('security', 'lockoutDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Require Special Characters</p>
                      <p className="text-sm text-gray-600">Passwords must contain special characters</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.passwordRequireSpecial}
                      onChange={(e) => handleSettingChange('security', 'passwordRequireSpecial', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Enable 2FA for enhanced security</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleResetSettings('notifications')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={() => handleSaveSettings('notifications')}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Send notifications via email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-600">Send browser push notifications</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.pushNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Digest Frequency</label>
                  <select
                    value={settings.notifications.digestFrequency}
                    onChange={(e) => handleSettingChange('notifications', 'digestFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Appearance Settings</h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleResetSettings('appearance')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={() => handleSaveSettings('appearance')}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select
                    value={settings.appearance.theme}
                    onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <input
                    type="color"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                    className="w-full h-10 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                  <input
                    type="color"
                    value={settings.appearance.accentColor}
                    onChange={(e) => handleSettingChange('appearance', 'accentColor', e.target.value)}
                    className="w-full h-10 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  <input
                    type="text"
                    value={settings.appearance.logoUrl}
                    onChange={(e) => handleSettingChange('appearance', 'logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Animations</p>
                    <p className="text-sm text-gray-600">Enable UI animations and transitions</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.appearance.animationsEnabled}
                    onChange={(e) => handleSettingChange('appearance', 'animationsEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">System Settings</h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleResetSettings('system')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={() => handleSaveSettings('system')}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                  <input
                    type="number"
                    value={settings.system.maxFileSize}
                    onChange={(e) => handleSettingChange('system', 'maxFileSize', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cleanup Days</label>
                  <input
                    type="number"
                    value={settings.system.cleanupDays}
                    onChange={(e) => handleSettingChange('system', 'cleanupDays', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                  <select
                    value={settings.system.backupFrequency}
                    onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Archive className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Auto Cleanup</p>
                      <p className="text-sm text-gray-600">Automatically clean up old files</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.system.autoCleanup}
                      onChange={(e) => handleSettingChange('system', 'autoCleanup', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Backup Enabled</p>
                      <p className="text-sm text-gray-600">Enable automatic system backups</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.system.backupEnabled}
                      onChange={(e) => handleSettingChange('system', 'backupEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">Maintenance Mode</p>
                      <p className="text-sm text-gray-600">Put the system in maintenance mode</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.system.maintenanceMode}
                      onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* User Settings */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">User Settings</h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleResetSettings('users')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={() => handleSaveSettings('users')}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default User Role</label>
                  <select
                    value={settings.users.defaultUserRole}
                    onChange={(e) => handleSettingChange('users', 'defaultUserRole', e.target.value)}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Users Per Department</label>
                  <input
                    type="number"
                    value={settings.users.maxUsersPerDepartment}
                    onChange={(e) => handleSettingChange('users', 'maxUsersPerDepartment', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Allow Registration</p>
                      <p className="text-sm text-gray-600">Allow new users to register</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.users.allowRegistration}
                      onChange={(e) => handleSettingChange('users', 'allowRegistration', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email Verification</p>
                      <p className="text-sm text-gray-600">Require email verification for registration</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.users.requireEmailVerification}
                      onChange={(e) => handleSettingChange('users', 'requireEmailVerification', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
