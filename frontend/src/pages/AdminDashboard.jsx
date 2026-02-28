import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { noticeAPI } from '../api'
import {
  Shield,
  Calendar,
  Bell,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  BarChart3,
  Users,
  Settings,
  Database,
  Activity,
  MonitorStop,
  UserCheck,
  FileText,
  AlertTriangle
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate } from '../utils/helpers'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [notices, setNotices] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent notices
        const noticesResponse = await noticeAPI.getNotices({
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        })
        setNotices(noticesResponse.data.data.notices || [])

        // Fetch admin stats
        try {
          const statsResponse = await noticeAPI.getNoticeStats()
          setStats(statsResponse.data.data || {})
        } catch (statsError) {
          console.log('Stats endpoint not available, calculating manually...')
          // Calculate stats manually if endpoint not available
          const allNotices = noticesResponse.data.data.notices || []
          setStats({
            totalNotices: allNotices.length,
            activeNotices: allNotices.filter(n => !n.expiresAt || new Date(n.expiresAt) > new Date()).length,
            totalViews: allNotices.reduce((sum, n) => sum + (n.viewCount || 0), 0),
            recentNotices: allNotices.filter(n => new Date(n.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
            highPriorityNotices: allNotices.filter(n => n.priority === 'HIGH' || n.priority === 'URGENT').length,
            academicNotices: allNotices.filter(n => n.category === 'Academic').length,
            administrativeNotices: allNotices.filter(n => n.category === 'Administrative').length
          })
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const StatCard = ({ title, value, icon: Icon, color = 'purple', trend = null, subtitle = null }) => {
    const colorClasses = {
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      violet: 'bg-violet-500',
      fuchsia: 'bg-fuchsia-500',
    }

    const iconColorClasses = {
      purple: 'text-purple-600',
      pink: 'text-pink-600',
      violet: 'text-violet-600',
      fuchsia: 'text-fuchsia-600',
    }

    return (
      <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-xl ${colorClasses[color]} bg-opacity-10`}>
              <Icon className={`w-6 h-6 ${iconColorClasses[color]}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
              {trend && (
                <p className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend > 0 ? '+' : ''}{trend}% this week
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const QuickActionCard = ({ title, description, icon: Icon, to, color = 'purple', badge = null }) => {
    const colorClasses = {
      purple: 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700',
      pink: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700',
      violet: 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700',
    }

    return (
      <Link
        to={to}
        className="block bg-white rounded-xl shadow-lg border border-purple-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative"
      >
        {badge && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-xl ${colorClasses[color]} text-white group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </Link>
    )
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'LOW': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  System Administration & Platform Management
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Access Level</p>
              <p className="text-lg font-semibold text-purple-600">{user?.accessLevel || 'Administrator'}</p>
            </div>
          </div>
        </div>

        {/* System Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Notices"
            value={stats.totalNotices || 0}
            icon={FileText}
            color="purple"
            trend={12}
          />
          <StatCard
            title="Active Notices"
            value={stats.activeNotices || 0}
            icon={MonitorStop}
            color="pink"
            trend={8}
          />
          <StatCard
            title="Total Views"
            value={stats.totalViews || 0}
            icon={Eye}
            color="violet"
            trend={25}
          />
          <StatCard
            title="Recent Updates"
            value={stats.recentNotices || 0}
            icon={Activity}
            color="fuchsia"
            trend={15}
          />
        </div>

        {/* Admin Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="Manage Notices"
            description="View and manage all notices"
            icon={FileText}
            to="/notices"
            color="purple"
          />
          <QuickActionCard
            title="User Management"
            description="Manage system users"
            icon={Users}
            to="/admin/users"
            color="pink"
            badge="New"
          />
          <QuickActionCard
            title="System Settings"
            description="Configure system settings"
            icon={Settings}
            to="/admin/settings"
            color="violet"
          />
          <QuickActionCard
            title="Analytics"
            description="View system analytics"
            icon={BarChart3}
            to="/admin/analytics"
            color="fuchsia"
          />
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-purple-500" />
              System Overview
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">Total Notices</span>
                <span className="text-sm font-medium text-purple-600">{stats.totalNotices || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <span className="text-sm text-gray-700">Academic Notices</span>
                <span className="text-sm font-medium text-pink-600">{stats.academicNotices || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg">
                <span className="text-sm text-gray-700">Administrative Notices</span>
                <span className="text-sm font-medium text-violet-600">{stats.administrativeNotices || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-fuchsia-50 rounded-lg">
                <span className="text-sm text-gray-700">High Priority Notices</span>
                <span className="text-sm font-medium text-fuchsia-600">{stats.highPriorityNotices || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-pink-500" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">New Notices Today</span>
                <span className="text-sm font-medium text-purple-600">
                  {notices.filter(n => new Date(n.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <span className="text-sm text-gray-700">Total Views Today</span>
                <span className="text-sm font-medium text-pink-600">
                  {notices.reduce((sum, n) => sum + (n.viewCount || 0), 0)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg">
                <span className="text-sm text-gray-700">System Status</span>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-fuchsia-50 rounded-lg">
                <span className="text-sm text-gray-700">Last Backup</span>
                <span className="text-sm font-medium text-fuchsia-600">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notices */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100">
          <div className="p-6 border-b border-purple-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Recent Notices
              </h2>
              <Link
                to="/notices"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
              >
                Manage all
                <Settings className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-purple-100">
            {notices.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <p className="text-gray-500">No notices found</p>
                <Link
                  to="/notices/create"
                  className="mt-4 inline-flex items-center text-purple-600 hover:text-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create first notice
                </Link>
              </div>
            ) : (
              notices.slice(0, 5).map((notice) => (
                <div key={notice._id} className="p-6 hover:bg-purple-50/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                          {notice.priority}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {notice.category || 'General'}
                        </span>
                        {notice.isPinned && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Bell className="w-3 h-3 mr-1" />
                            Pinned
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {notice.postedBy?.role}
                        </span>
                      </div>

                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        <Link
                          to={`/notices/${notice._id}`}
                          className="hover:text-purple-600 transition-colors"
                        >
                          {notice.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {notice.description}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(notice.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{notice.viewCount || 0} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserCheck className="w-4 h-4" />
                          <span>{notice.postedBy?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Admin Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Create Notice"
            description="Create a new system notice"
            icon={Plus}
            to="/notices/create"
            color="purple"
          />
          <QuickActionCard
            title="User Management"
            description="Manage users and permissions"
            icon={Users}
            to="/admin/users"
            color="pink"
          />
          <QuickActionCard
            title="System Settings"
            description="Configure system parameters"
            icon={Settings}
            to="/admin/settings"
            color="violet"
          />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
