import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Home,
  FileText,
  Users,
  Calendar,
  Settings,
  BookOpen,
  Bell,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react'
import { useState } from 'react'

const Sidebar = ({ isOpen, onToggle }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [expandedSections, setExpandedSections] = useState({})

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: Home },
      { path: '/notices', label: 'Notices', icon: FileText },
      { path: '/profile', label: 'Profile', icon: User },
    ]

    const roleSpecificItems = {
      ADMIN: [
        {
          label: 'Admin Panel',
          icon: Settings,
          children: [
            { path: '/admin/users', label: 'Manage Users', icon: Users },
            { path: '/admin/notices', label: 'Manage Notices', icon: FileText },
            { path: '/admin/settings', label: 'Settings', icon: Settings },
            { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
          ]
        }
      ],
      FACULTY: [
        {
          label: 'Faculty Tools',
          icon: BookOpen,
          children: [
            { path: '/notices/create', label: 'Create Notice', icon: FileText },
            { path: '/faculty/my-notices', label: 'My Notices', icon: FileText },
            { path: '/faculty/students', label: 'Students', icon: Users },
            { path: '/faculty/schedule', label: 'Schedule', icon: Calendar },
          ]
        }
      ],
      // STUDENT: [
      //   {
      //     label: 'Student Resources',
      //     icon: BookOpen,
      //     children: [
      //       { path: '/student/courses', label: 'Courses', icon: BookOpen },
      //       { path: '/student/assignments', label: 'Assignments', icon: FileText },
      //       { path: '/student/grades', label: 'Grades', icon: BarChart3 },
      //       { path: '/student/calendar', label: 'Calendar', icon: Calendar },
      //     ]
      //   }
      // ]
    }

    const menuItems = [...baseItems]

    if (user?.role && roleSpecificItems[user.role]) {
      menuItems.push(...roleSpecificItems[user.role])
    }

    return menuItems
  }

  const menuItems = getMenuItems()

  const renderMenuItem = (item, level = 0) => {
    if (item.children) {
      return (
        <div key={item.label} className="mb-2">
          <button
            onClick={() => toggleSection(item.label)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${expandedSections[item.label]
              ? ''
              : ''
              }`}
            style={{ paddingLeft: `${level * 12 + 16}px` }}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${expandedSections[item.label] ? 'rotate-180' : ''
                }`}
            />
          </button>

          {expandedSections[item.label] && (
            <div className="mt-1 space-y-1">
              {item.children.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.path)
          ? ' bg-blue-200 text-white shadow-md'
          : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:shadow-sm'
          }`}
        style={{ paddingLeft: `${level * 12 + 16}px` }}
      >
        <item.icon className="w-4 h-4" />
        <span>{item.label}</span>
      </Link>
    )
  }

  return (
    <>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
        ${isOpen ? 'w-64' : 'w-64'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">Notice Board</span>
          </div>
          {/* Mobile menu toggle button */}
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

      </div>
    </>
  )
}

export default Sidebar
