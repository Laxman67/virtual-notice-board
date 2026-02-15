import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data, {
    headers: {
      'Content-Type': "application/json"
    },
    withCredentials: true
  }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData)
}

// Notice API
export const noticeAPI = {
  getNotices: (params = {}) => api.get(`/notices`, { params }),
  getNotice: (id) => api.get(`/notices/${id}`),
  createNotice: (noticeData) => api.post('/notices', noticeData),
  updateNotice: (id, noticeData) => api.put(`/notices/${id}`, noticeData),
  deleteNotice: (id) => api.delete(`/notices/${id}`),
  getNoticeStats: () => api.get('/notices/stats')
}

export default api
