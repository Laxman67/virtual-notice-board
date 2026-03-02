import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { noticeAPI } from '../api'
import {
  Users,
  TrendingUp,
  Bell,
  Calendar,
  Eye,
  Plus,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  MonitorStop
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate } from '../utils/helpers'

const Dashboard = () => {
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

        // Fetch stats if admin
        if (user?.role === 'ADMIN') {
          const statsResponse = await noticeAPI.getNoticeStats()
          setStats(statsResponse.data.data || {})
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const StatCard = ({ title, value, icon: Icon, color = 'blue', trend = null }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
    }

    const iconColorClasses = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      red: 'text-red-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${colorClasses[color]} bg-opacity-10`}>
              <Icon className={`w-6 h-6 ${iconColorClasses[color]}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend && (
                <p className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend > 0 ? '+' : ''}{trend}% from last month
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const QuickActionCard = ({ title, description, icon: Icon, to, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-500 hover:bg-blue-600',
      green: 'bg-green-500 hover:bg-green-600',
      purple: 'bg-purple-500 hover:bg-purple-600',
      orange: 'bg-orange-500 hover:bg-orange-600',
    }

    return (
      <Link
        to={to}
        className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
      >
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]} text-white`}>
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your notice board today.
          </p>
        </div>

        {(user?.role === 'FACULTY' || user?.role === 'ADMIN') && (
          <Link
            to="/notices/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Notice
          </Link>
        )}
      </div>

      {/* Stats Grid - Admin Only */}
      {user?.role === 'ADMIN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Notices"
            value={stats.totalNotices || 0}
            icon={MonitorStop}
            color="blue"
            trend={12}
          />
          <StatCard
            title="Active Notices"
            value={stats.activeNotices || 0}
            icon={TrendingUp}
            color="green"
            trend={8}
          />
          {/* <StatCard
            title="Pinned Notices"
            value={stats.pinnedNotices || 0}
            icon={Bell}
            color="yellow"
            trend={-2}
          /> */}
          <StatCard
            title="Recent Views"
            value={stats.recentViews || 0}
            icon={Eye}
            color="purple"
            trend={25}
          />
        </div>
      )}

      {/* User Dashboard - Non-Admin */}
      {user?.role !== 'ADMIN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Total Notices"
            value={notices.length}
            icon={MonitorStop}
            color="blue"
          />
          <StatCard
            title="Recent Updates"
            value={notices.filter(n => new Date(n.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            icon={Activity}
            color="green"
          />
          {/* <StatCard
            title="Pinned Notices"
            value={notices.filter(n => n.isPinned).length}
            icon={Bell}
            color="yellow"
          /> */}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickActionCard
          title="View All Notices"
          description="Browse all available notices"
          icon={MonitorStop}
          to="/notices"
          color="blue"
        />

        {(user?.role === 'FACULTY' || user?.role === 'ADMIN') && (
          <>
            <QuickActionCard
              title="Create Notice"
              description="Create a new notice"
              icon={Plus}
              to="/notices/create"
              color="green"
            />
            <QuickActionCard
              title="Manage Notices"
              description="Edit or delete notices"
              icon={BarChart3}
              to="/notices"
              color="purple"
            />
          </>
        )}

        {/* <QuickActionCard
          title="My Profile"
          description="Update your profile information"
          icon={Users}
          to="/profile"
          color="orange"
        /> */}

        {/* {user?.role === 'ADMIN' && (
          <QuickActionCard
            title="Admin Panel"
            description="View admin statistics"
            icon={Activity}
            to="/admin"
            color="red"
          />
        )} */}
      </div>

      {/* Recent Notices */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Notices
            </h2>
            <Link
              to="/notices"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {notices.length === 0 ? (
            <div className="p-8 text-center">
              <MonitorStop className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notices found</p>
              {(user?.role === 'FACULTY' || user?.role === 'ADMIN') && (
                <Link
                  to="/notices/create"
                  className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create first notice
                </Link>
              )}
            </div>
          ) : (
            notices.map((notice) => (
              <div key={notice._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                        {notice.priority}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {notice.category || 'General'}
                      </span>
                      {notice.isPinned && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Bell className="w-3 h-3 mr-1" />
                          Pinned
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      <Link
                        to={`/notices/${notice._id}`}
                        className="hover:text-blue-600 transition-colors"
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
                        <span>by {notice.postedBy?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">API Status</span>
              </div>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Database</span>
              </div>
              <span className="text-sm font-medium text-green-600">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">Last Updated</span>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {formatDate(new Date())}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Notices this week</span>
              <span className="text-sm font-medium text-gray-900">
                {notices.filter(n => new Date(n.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">High priority notices</span>
              <span className="text-sm font-medium text-gray-900">
                {notices.filter(n => n.priority === 'HIGH' || n.priority === 'URGENT').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Expired notices</span>
              <span className="text-sm font-medium text-gray-900">
                {notices.filter(n => n.expiresAt && new Date(n.expiresAt) < new Date()).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
