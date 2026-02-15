import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { memo, useCallback, useMemo } from 'react'
import {
  Home,
  FileText,
  User,
  Settings,
  LogOut
} from 'lucide-react'

const Navbar = memo(() => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = useCallback(async () => {
    await logout()
    navigate('/login')
  }, [logout, navigate])

  const isActive = useCallback((path) => location.pathname === path, [location.pathname])

  const navItems = useMemo(() => {
    const items = [
      { path: '/dashboard', label: 'Dashboard', icon: Home },
      { path: '/notices', label: 'Notices', icon: FileText },
      { path: '/profile', label: 'Profile', icon: User },
    ]

    if (user?.role === 'ADMIN') {
      items.push({ path: '/admin', label: 'Admin', icon: Settings })
    }

    return items
  }, [user?.role])

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Navigation Items */}
        <div className="flex items-center space-x-1">
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium  ${isActive(item.path)
                    ? 'bg-blue-600  border-r-2 '
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <span className={`${isActive(item.path) ? 'text-white' : 'text-gray-600'}`}>
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right side - User Menu */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive('/profile') ? 'bg-blue-600' : ''}`}>
              <span className={`text-white text-sm font-medium ${isActive('/profile') ? 'text-white' : 'text-gray-600'}`}>
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium ${isActive('/profile') ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]`}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
})

export default Navbar
