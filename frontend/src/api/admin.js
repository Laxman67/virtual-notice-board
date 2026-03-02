import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Analytics API
export const analyticsAPI = {
  getAnalytics: (dateRange = '7d') => api.get(`/analytics?dateRange=${dateRange}`),
  getUserAnalytics: (dateRange = '7d') => api.get(`/analytics/users?dateRange=${dateRange}`),
  getNoticeAnalytics: (dateRange = '7d') => api.get(`/analytics/notices?dateRange=${dateRange}`),
}

// Settings API
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  getSettingsByCategory: (category) => api.get(`/settings/${category}`),
  updateSettings: (category, data) => api.put(`/settings/${category}`, data),
  resetSettings: (category) => api.post(`/settings/${category}/reset`),
  exportSettings: () => api.get('/settings/export/all'),
  importSettings: (data) => api.post('/settings/import', { settingsData: data }),
}

// Enhanced User API
export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserStats: () => api.get('/users/stats'),
  activateUser: (id) => api.put(`/users/${id}`, { isActive: true }),
  deactivateUser: (id) => api.put(`/users/${id}`, { isActive: false }),
  resetPassword: (id) => api.post(`/users/${id}/reset-password`),
}

// Enhanced Notice API
export const noticeAPI = {
  getNotices: (params) => api.get('/notices', { params }),
  getNotice: (id) => api.get(`/notices/${id}`),
  createNotice: (data) => api.post('/notices', data),
  updateNotice: (id, data) => api.put(`/notices/${id}`, data),
  deleteNotice: (id) => api.delete(`/notices/${id}`),
  getNoticeStats: () => api.get('/notices/stats'),
  pinNotice: (id) => api.put(`/notices/${id}`, { isPinned: true }),
  unpinNotice: (id) => api.put(`/notices/${id}`, { isPinned: false }),
  archiveNotice: (id) => api.put(`/notices/${id}`, { isArchived: true }),
  unarchiveNotice: (id) => api.put(`/notices/${id}`, { isArchived: false }),
  duplicateNotice: (id) => api.post(`/notices/${id}/duplicate`),
}

export default api
