import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { noticeAPI } from '../api'
import {
  BookOpen,
  Calendar,
  Bell,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Users,
  Target
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate } from '../utils/helpers'

const StudentDashboard = () => {
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

        // Calculate student-specific stats
        const studentNotices = noticesResponse.data.data.notices || []
        setStats({
          totalNotices: studentNotices.length,
          recentNotices: studentNotices.filter(n => new Date(n.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
          highPriorityNotices: studentNotices.filter(n => n.priority === 'HIGH' || n.priority === 'URGENT').length,
          academicNotices: studentNotices.filter(n => n.category === 'Academic').length,
          unreadNotices: studentNotices.filter(n => !n.isRead).length
        })
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const StatCard = ({ title, value, icon: Icon, color = 'blue', trend = null }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      indigo: 'bg-indigo-500',
      sky: 'bg-sky-500',
      cyan: 'bg-cyan-500',
    }

    const iconColorClasses = {
      blue: 'text-blue-600',
      indigo: 'text-indigo-600',
      sky: 'text-sky-600',
      cyan: 'text-cyan-600',
    }

    return (
      <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

  const QuickActionCard = ({ title, description, icon: Icon, to, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
      indigo: 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700',
      sky: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700',
    }

    return (
      <Link
        to={to}
        className="block bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600">
                  Here's your academic dashboard - stay updated with latest notices
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Student ID</p>
              <p className="text-lg font-semibold text-blue-600">{user?.studentId || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Notices"
            value={stats.totalNotices || 0}
            icon={BookOpen}
            color="blue"
            trend={12}
          />
          <StatCard
            title="Recent Updates"
            value={stats.recentNotices || 0}
            icon={TrendingUp}
            color="indigo"
            trend={8}
          />
          <StatCard
            title="High Priority"
            value={stats.highPriorityNotices || 0}
            icon={AlertCircle}
            color="sky"
            trend={-5}
          />
          <StatCard
            title="Academic Notices"
            value={stats.academicNotices || 0}
            icon={Target}
            color="cyan"
            trend={15}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="All Notices"
            description="Browse all available notices"
            icon={BookOpen}
            to="/notices"
            color="blue"
          />
          <QuickActionCard
            title="Academic"
            description="Academic related notices"
            icon={GraduationCap}
            to="/notices?category=Academic"
            color="indigo"
          />
          {/* <QuickActionCard
            title="My Profile"
            description="Update your profile information"
            icon={Users}
            to="/profile"
            color="sky"
          /> */}
          <QuickActionCard
            title="Calendar"
            description="View academic calendar"
            icon={Calendar}
            to="/calendar"
            color="cyan"
          />
        </div>

        {/* Recent Notices */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100">
          <div className="p-6 border-b border-blue-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-600" />
                Recent Notices
              </h2>
              <Link
                to="/notices"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                View all
                <TrendingUp className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-blue-100">
            {notices.length === 0 ? (
              <div className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-500">No notices found</p>
              </div>
            ) : (
              notices.map((notice) => (
                <div key={notice._id} className="p-6 hover:bg-blue-50/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                          {notice.priority}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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

        {/* Academic Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Quick Links
            </h3>
            <div className="space-y-3">
              <Link to="/notices?category=Academic" className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
                <BookOpen className="w-4 h-4 mr-3 text-blue-600" />
                <span className="text-gray-700">Academic Notices</span>
              </Link>
              <Link to="/notices?category=Events" className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
                <Calendar className="w-4 h-4 mr-3 text-blue-600" />
                <span className="text-gray-700">Events & Activities</span>
              </Link>
              <Link to="/notices?priority=HIGH" className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
                <AlertCircle className="w-4 h-4 mr-3 text-orange-600" />
                <span className="text-gray-700">High Priority Notices</span>
              </Link>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Study Schedule
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Next Class</span>
                <span className="text-sm font-medium text-blue-600">Computer Science - 10:00 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                <span className="text-sm text-gray-700">Assignment Due</span>
                <span className="text-sm font-medium text-indigo-600">Math - Tomorrow</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                <span className="text-sm text-gray-700">Exam Schedule</span>
                <span className="text-sm font-medium text-sky-600">Next Week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
