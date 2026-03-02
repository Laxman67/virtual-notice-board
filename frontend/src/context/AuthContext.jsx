import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          return
        }

        const response = await authAPI.getProfile()
        const userData = response.data.data.user

        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth initialization error:', error)
        localStorage.removeItem('token')
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await authAPI.login(credentials)
      const { user: userData, token } = response.data.data

      localStorage.setItem('token', token)
      setUser(userData)
      setIsAuthenticated(true)

      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await authAPI.register(userData)
      const { user: newUser, token } = response.data.data

      localStorage.setItem('token', token)
      setUser(newUser)
      setIsAuthenticated(true)

      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      setIsAuthenticated(false)
      toast.success('Logged out successfully')
      // Redirect to login page
      window.location.href = '/'
    }
  }

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData)
      setUser(response.data.data.user)
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const forgotPassword = async (email) => {
    try {
      setLoading(true)
      const response = await authAPI.forgotPassword(email)
      toast.success('Password reset link has been sent to your email!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true)
      const response = await authAPI.resetPassword(token, newPassword)
      toast.success('Password has been reset successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
