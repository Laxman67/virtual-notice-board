import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminSidebar from './AdminSidebar'
import LoadingSpinner from './LoadingSpinner'

const AdminLayout = () => {
  const { user, loading } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-pink-50 to-rose-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Don't check role here - let the routes handle access control
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <AdminSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-purple-100 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {user?.role === 'ADMIN' ? 'Admin Panel' :
                user?.role === 'FACULTY' ? 'Faculty Panel' : 'Student Panel'}
            </h1>
            <div className="w-10" /> {/* Spacer for balance */}
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
