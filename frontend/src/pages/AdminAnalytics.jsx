import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { analyticsAPI } from '../api/admin'
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Eye,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  PieChart,
  LineChart,
  Zap,
  Target,
  Award,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const AdminAnalytics = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      totalNotices: 0,
      totalViews: 0,
      activeUsers: 0,
      newUsers: 0,
      newNotices: 0
    },
    userStats: {
      byRole: {},
      byDepartment: {},
      registrationTrend: [],
      activeUsers: []
    }
  })
  const [dateRange, setDateRange] = useState('7d')
  const [activeChart, setActiveChart] = useState('overview')

  console.log('AdminAnalytics component mounted - user:', user?.role)

  const fetchAnalytics = useCallback(async () => {
    try {
      console.log('Fetching analytics data...')
      setLoading(true)

      // Check if analyticsAPI is available
      if (!analyticsAPI || !analyticsAPI.getAnalytics) {
        console.error('analyticsAPI not available')
        toast.error('Analytics API not available')
        return
      }

      const response = await analyticsAPI.getAnalytics(dateRange)
      console.log('Analytics response received:', response)

      if (response && response.data && response.data.data) {
        setAnalytics(response.data.data)
        console.log('Analytics data set successfully')
      } else {
        console.error('Invalid response format:', response)
        toast.error('Invalid analytics data format')
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
      toast.error(`Failed to fetch analytics: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    console.log('AdminAnalytics useEffect called')
    fetchAnalytics()
  }, [fetchAnalytics])

  const exportAnalytics = () => {
    const dataStr = JSON.stringify(analytics, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.json`
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    toast.success('Analytics exported successfully')
  }

  const StatCard = ({ title, value, color = 'purple', trend = null, subtitle = null }) => {
    const colorClasses = {
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      violet: 'bg-violet-500',
      fuchsia: 'bg-fuchsia-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500'
    }

    const iconColorClasses = {
      purple: 'text-purple-600',
      pink: 'text-pink-600',
      violet: 'text-violet-600',
      fuchsia: 'text-fuchsia-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      orange: 'text-orange-600'
    }

    return (
      <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-xl ${colorClasses[color]} bg-opacity-10`}>
              <div className={`w-6 h-6 ${iconColorClasses[color]} rounded`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
              {trend && (
                <p className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend > 0 ? '+' : ''}{trend}% this period
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'FACULTY') {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access analytics.</p>
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600">System performance and user engagement insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
              <button
                onClick={exportAnalytics}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Users"
            value={analytics.overview.totalUsers}
            color="purple"
            trend={12}
          />
          <StatCard
            title="Active Users"
            value={analytics.overview.activeUsers}
            color="green"
            trend={8}
          />
          <StatCard
            title="New Users"
            value={analytics.overview.newUsers}
            color="blue"
            trend={25}
          />
          <StatCard
            title="Total Notices"
            value={analytics.overview.totalNotices}
            color="pink"
            trend={15}
          />
          <StatCard
            title="Total Views"
            value={analytics.overview.totalViews}
            color="violet"
            trend={32}
          />
          <StatCard
            title="New Notices"
            value={analytics.overview.newNotices}
            color="orange"
            trend={18}
          />
        </div>

        {/* Chart Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-2">
          <div className="flex flex-wrap space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'notices', label: 'Notices', icon: FileText },
              { id: 'system', label: 'System', icon: Monitor }
            ].map((chart) => {
              const Icon = chart.icon
              return (
                <button
                  key={chart.id}
                  onClick={() => setActiveChart(chart.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeChart === chart.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                    : 'text-gray-600 hover:bg-purple-50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{chart.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Charts Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Registration Trend */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
              User Registration Trend
            </h3>
            <div className="h-64 flex items-center justify-center bg-purple-50 rounded-lg">
              <div className="text-center">
                <LineChart className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <p className="text-gray-600">Line chart showing user registration over time</p>
                <div className="mt-4 space-y-2">
                  {analytics.userStats.registrationTrend.slice(-3).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.date}</span>
                      <span className="font-medium text-purple-600">{item.users} users</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Users Trend */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-500" />
              Active Users Trend
            </h3>
            <div className="h-64 flex items-center justify-center bg-green-50 rounded-lg">
              <div className="text-center">
                <LineChart className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-600">Line chart showing daily active users</p>
                <div className="mt-4 space-y-2">
                  {analytics.userStats.activeUsers.slice(-3).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.date}</span>
                      <span className="font-medium text-green-600">{item.active} active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Users by Role */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Users by Role
            </h3>
            <div className="h-64 flex items-center justify-center bg-blue-50 rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600">Pie chart showing user distribution</p>
                <div className="mt-4 space-y-2">
                  {Object.entries(analytics.userStats.byRole).map(([role, count]) => (
                    <div key={role} className="flex justify-between text-sm">
                      <span className="text-gray-600">{role}</span>
                      <span className="font-medium text-blue-600">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notices by Category */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-pink-500" />
              Notices by Category
            </h3>
            <div className="h-64 flex items-center justify-center bg-pink-50 rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <p className="text-gray-600">Pie chart showing notice categories</p>
                <div className="mt-4 space-y-2">
                  {Object.entries(analytics.noticeStats.byCategory).map(([category, count]) => (
                    <div key={category} className="flex justify-between text-sm">
                      <span className="text-gray-600">{category}</span>
                      <span className="font-medium text-pink-600">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Device Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Monitor className="w-5 h-5 mr-2 text-purple-500" />
              Device Usage
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics.systemStats.deviceUsage).map(([device, count]) => {
                const percentage = (count / Object.values(analytics.systemStats.deviceUsage).reduce((a, b) => a + b, 0) * 100).toFixed(1)
                const DeviceIcon = device === 'Desktop' ? Monitor : device === 'Mobile' ? Smartphone : Tablet
                return (
                  <div key={device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <DeviceIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{device}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{percentage}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Browser Usage */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-500" />
              Browser Usage
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics.systemStats.browserUsage).map(([browser, count]) => {
                const percentage = (count / Object.values(analytics.systemStats.browserUsage).reduce((a, b) => a + b, 0) * 100).toFixed(1)
                return (
                  <div key={browser} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{browser}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{percentage}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-green-500" />
              Peak Activity Hours
            </h3>
            <div className="space-y-2">
              {analytics.systemStats.peakHours.slice(0, 6).map((hour, index) => {
                const maxUsers = Math.max(...analytics.systemStats.peakHours.map(h => h.users))
                const percentage = (hour.users / maxUsers * 100).toFixed(1)
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{hour.hour}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{hour.users}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Popular Notices */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Popular Notices
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-50 border-b border-purple-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Notice Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Views</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {analytics.noticeStats.popularNotices.map((notice, index) => (
                  <tr key={index} className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{notice.title}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {notice.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{(notice.views || notice.viewCount || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                            style={{ width: `${((notice.views || notice.viewCount || 0) / (analytics.noticeStats.popularNotices[0]?.views || analytics.noticeStats.popularNotices[0]?.viewCount || 1) * 100)}%` }}
                          />
                        </div>
                        <Target className="w-4 h-4 text-orange-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics
