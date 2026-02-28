import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, Award, Shield } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const Login = () => {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const result = await login(formData)
    console.log(result)
    if (result.success) {
      navigate('/dashboard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{
      backgroundImage: `url("https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Professional Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/60"></div>
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/30">
          <div className="flex justify-center">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600 rounded-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Virtual Notice Board</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-800">
            Sign in to your account
          </h2>
          {/* <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              create a new account
            </Link>
          </p> */}
        </div>

        {/* Professional Role Selection */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-xl">
          <p className="text-center text-sm font-medium text-gray-700 mb-6">
            Select your role to continue
          </p>
          <div className="grid grid-cols-3 gap-3">
            <Link
              to="/login/student"
              className="group flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all duration-200"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700 group-hover:text-blue-700">Student</span>
            </Link>
            <Link
              to="/login/faculty"
              className="group flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-emerald-50 hover:border-emerald-200 border-2 border-transparent transition-all duration-200"
            >
              <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <Award className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700 group-hover:text-emerald-700">Faculty</span>
            </Link>
            <Link
              to="/login/admin"
              className="group flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-purple-50 hover:border-purple-200 border-2 border-transparent transition-all duration-200"
            >
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700 group-hover:text-purple-700">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
    // </div >
  )
}

export default Login
