import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react'
import { useState } from 'react'

const AdminSidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Notices',
      path: '/dashboard/notices',
      icon: FileText
    },
    {
      title: 'Profile',
      path: '/dashboard/profile',
      icon: Users
    }
  ]

  const adminMenuItems = [
    {
      title: 'Manage Users',
      path: '/dashboard/users',
      icon: Users,
      badge: 'New'
    },
    {
      title: 'Manage Notices',
      path: '/dashboard/notices',
      icon: FileText
    },
    {
      title: 'Analytics',
      path: '/dashboard/analytics',
      icon: BarChart3
    },
    {
      title: 'Settings',
      path: '/dashboard/settings',
      icon: Settings
    }
  ]

  const facultyMenuItems = [
    {
      title: 'Manage Notices',
      path: '/dashboard/notices',
      icon: FileText
    },
    {
      title: 'Analytics',
      path: '/dashboard/analytics',
      icon: BarChart3
    }
  ]

  const allMenuItems = user?.role === 'ADMIN' ? [...menuItems, ...adminMenuItems] :
    user?.role === 'FACULTY' ? [...menuItems, ...facultyMenuItems] :
      menuItems

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-full bg-white/95 backdrop-blur-sm border-r border-purple-100 z-50 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-purple-100">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {user?.role === 'ADMIN' ? 'Admin Panel' :
                      user?.role === 'FACULTY' ? 'Faculty Panel' : 'Student Panel'}
                  </h2>
                  <p className="text-xs text-gray-600">
                    {user?.role === 'ADMIN' ? 'System Management' :
                      user?.role === 'FACULTY' ? 'Faculty Management' : 'Student Dashboard'}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsMobileOpen(false)
                } else {
                  setIsCollapsed(!isCollapsed)
                }
              }}
              className="p-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-b border-purple-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role || 'ADMIN'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {allMenuItems.map((item) => {
            const ItemIcon = item.icon
            const active = isActive(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative flex items-center p-3 rounded-lg transition-colors group
                  ${active
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                  }
                  ${isCollapsed ? 'justify-center' : 'justify-between'}
                `}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsMobileOpen(false)
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <ItemIcon className="w-5 h-5" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className={`
                    px-2 py-1 text-xs rounded-full
                    ${item.badge === 'Admin'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-red-500 text-white'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-purple-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar
