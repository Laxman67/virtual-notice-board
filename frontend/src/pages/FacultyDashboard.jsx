import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { noticeAPI } from '../api'
import {
  Award,
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
  BookOpen,
  Edit,
  Trash2
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate } from '../utils/helpers'

const FacultyDashboard = () => {
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

        // Calculate faculty-specific stats
        const facultyNotices = noticesResponse.data.data.notices || []
        const myNotices = facultyNotices.filter(n => n.postedBy?._id === user?._id)

        // Try to get total notices count (fallback if API fails)
        let totalNotices = 0
        try {
          const allNoticesResponse = await noticeAPI.getNotices({
            limit: 1, // Just get count
            sortBy: 'createdAt',
            sortOrder: 'desc'
          })
          totalNotices = allNoticesResponse.data.data?.notices?.length || 0
        } catch (error) {
          console.log('Failed to fetch total notices count:', error)
          // Use the notices we already fetched as fallback
          totalNotices = facultyNotices.length
        }

        setStats({
          totalNotices: totalNotices, // Use total count instead of just faculty notices
          myNotices: myNotices.length,
          recentNotices: facultyNotices.filter(n => new Date(n.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
          totalViews: facultyNotices.reduce((sum, n) => sum + (n.viewCount || 0), 0),
          academicNotices: facultyNotices.filter(n => n.category === 'Academic').length,
          highPriorityNotices: facultyNotices.filter(n => n.priority === 'HIGH' || n.priority === 'URGENT').length
        })
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const StatCard = ({ title, value, icon: Icon, color = 'emerald', trend = null }) => {
    const colorClasses = {
      emerald: 'bg-emerald-500',
      teal: 'bg-teal-500',
      green: 'bg-green-500',
      lime: 'bg-lime-500',
    }

    const iconColorClasses = {
      emerald: 'text-emerald-600',
      teal: 'text-teal-600',
      green: 'text-green-600',
      lime: 'text-lime-600',
    }

    return (
      <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-xl ${colorClasses[color]} bg-opacity-10`}>
              <Icon className={`w-6 h-6 ${iconColorClasses[color]}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
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

  const QuickActionCard = ({ title, description, icon: Icon, to, color = 'emerald' }) => {
    const colorClasses = {
      emerald: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
      teal: 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700',
      green: 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700',
    }

    return (
      <Link
        to={to}
        className="block bg-white rounded-xl shadow-lg border border-emerald-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
      >
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100 p-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600">
                  Faculty Dashboard - Manage your academic content and notices
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Department</p>
              <p className="text-lg font-semibold text-emerald-600">{user?.department || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="My Notices"
            value={stats.myNotices || 0}
            icon={BookOpen}
            color="emerald"
            trend={12}
          />
          <StatCard
            title="Total Views"
            value={stats.totalViews || 0}
            icon={Eye}
            color="teal"
            trend={25}
          />
          <StatCard
            title="Recent Updates"
            value={stats.recentNotices || 0}
            icon={TrendingUp}
            color="green"
            trend={8}
          />
          <StatCard
            title="High Priority"
            value={stats.highPriorityNotices || 0}
            icon={AlertCircle}
            color="lime"
            trend={-5}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="Create Notice"
            description="Create a new notice"
            icon={Plus}
            to="/notices/create"
            color="emerald"
          />
          <QuickActionCard
            title="Manage Notices"
            description="Edit or delete notices"
            icon={Edit}
            to="/notices"
            color="teal"
          />
          <QuickActionCard
            title="Analytics"
            description="View notice statistics"
            icon={BarChart3}
            to="/analytics"
            color="green"
          />
          {/* <QuickActionCard
            title="My Profile"
            description="Update your profile"
            icon={Users}
            to="/profile"
            color="lime"
          /> */}
        </div>

        {/* Recent Notices */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100">
          <div className="p-6 border-b border-emerald-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
                My Recent Notices
              </h2>
              <Link
                to="/notices"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center"
              >
                Manage all
                <Edit className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-emerald-100">
            {notices.length === 0 ? (
              <div className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <p className="text-gray-500">No notices found</p>
                <Link
                  to="/notices/create"
                  className="mt-4 inline-flex items-center text-emerald-600 hover:text-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create first notice
                </Link>
              </div>
            ) : (
              notices.slice(0, 5).map((notice) => (
                <div key={notice._id} className="p-6 hover:bg-emerald-50/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                          {notice.priority}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
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
                          className="hover:text-emerald-600 transition-colors"
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
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => window.location.href = `/notices/${notice._id}/edit`}
                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                        title="Edit notice"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this notice?')) {
                            // Handle delete
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Faculty Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-emerald-500" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link to="/notices/create" className="flex items-center p-3 rounded-lg hover:bg-emerald-50 transition-colors">
                <Plus className="w-4 h-4 mr-3 text-emerald-600" />
                <span className="text-gray-700">Create New Notice</span>
              </Link>
              <Link to="/notices/create?category=Academic" className="flex items-center p-3 rounded-lg hover:bg-emerald-50 transition-colors">
                <BookOpen className="w-4 h-4 mr-3 text-emerald-600" />
                <span className="text-gray-700">Academic Notice</span>
              </Link>
              <Link to="/notices/create?category=Events" className="flex items-center p-3 rounded-lg hover:bg-emerald-50 transition-colors">
                <Calendar className="w-4 h-4 mr-3 text-emerald-600" />
                <span className="text-gray-700">Event Notice</span>
              </Link>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-teal-500" />
              Performance Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <span className="text-sm text-gray-700">Total Notices Created</span>
                <span className="text-sm font-medium text-emerald-600">{stats.myNotices || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                <span className="text-sm text-gray-700">Total Views</span>
                <span className="text-sm font-medium text-teal-600">{stats.totalViews || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Avg Views per Notice</span>
                <span className="text-sm font-medium text-green-600">
                  {stats.myNotices > 0 ? Math.round((stats.totalViews || 0) / stats.myNotices) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacultyDashboard
