import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { noticeAPI } from '../api'
import { toast } from 'react-toastify'
import {
  FileText,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Bell,
  Pin,
  TrendingUp,
  AlertTriangle,
  Download,
  Upload,
  ChevronDown,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate } from '../utils/helpers'

const ManageNotices = () => {
  const { user } = useAuth()
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedNotices, setSelectedNotices] = useState([])
  const [viewMode, setViewMode] = useState('table') // table or grid

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    try {
      setLoading(true)
      console.log('Fetching notices with params:', {
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })

      const response = await noticeAPI.getNotices({
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })

      console.log('API response:', response)
      console.log('Notices received:', response.data.data?.notices)
      console.log('Notices count:', response.data.data?.notices?.length)

      setNotices(response.data.data.notices || [])
    } catch (error) {
      toast.error('Failed to fetch notices')
      console.error('Error fetching notices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNoticeAction = async (action, noticeId) => {
    try {
      switch (action) {
        case 'pin':
          toast.success('Notice pinned successfully')
          break
        case 'unpin':
          toast.success('Notice unpinned successfully')
          break
        case 'delete':
          if (window.confirm('Are you sure you want to delete this notice?')) {
            await noticeAPI.deleteNotice(noticeId)
            toast.success('Notice deleted successfully')
            setNotices(notices.filter(n => n._id !== noticeId))
          }
          break
        case 'archive':
          toast.success('Notice archived successfully')
          break
        case 'duplicate':
          toast.success('Notice duplicated successfully')
          break
        default:
          break
      }
    } catch (error) {
      toast.error('Action failed')
      console.error('Error performing notice action:', error)
    }
  }

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || notice.category === filterCategory
    const matchesPriority = filterPriority === 'all' || notice.priority === filterPriority
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && !notice.isArchived) ||
      (filterStatus === 'archived' && notice.isArchived) ||
      (filterStatus === 'expired' && new Date(notice.expiresAt) < new Date())
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'LOW': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Academic': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Administrative': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Events': return 'bg-green-100 text-green-800 border-green-200'
      case 'Examinations': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Holidays': return 'bg-pink-100 text-pink-800 border-pink-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (notice) => {
    if (notice.isArchived) return 'bg-gray-100 text-gray-800 border-gray-200'
    if (notice.expiresAt && new Date(notice.expiresAt) < new Date()) return 'bg-red-100 text-red-800 border-red-200'
    return 'bg-green-100 text-green-800 border-green-200'
  }

  const getStatusText = (notice) => {
    if (notice.isArchived) return 'Archived'
    if (notice.expiresAt && new Date(notice.expiresAt) < new Date()) return 'Expired'
    return 'Active'
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'FACULTY') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access notice management.</p>
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
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Notice Management
                </h1>
                <p className="text-gray-600">Manage and organize all system notices</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white border border-purple-200 rounded-lg">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-sm ${viewMode === 'table' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'} transition-colors`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'} transition-colors`}
                >
                  Grid
                </button>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <Link
                to="/dashboard/notices/create"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Notice</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notices</p>
                <p className="text-2xl font-bold text-gray-900">{notices.length}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {notices.filter(n => !n.isArchived && (!n.expiresAt || new Date(n.expiresAt) > new Date())).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pinned</p>
                <p className="text-2xl font-bold text-blue-600">
                  {notices.filter(n => n.isPinned).length}
                </p>
              </div>
              <Pin className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-purple-600">
                  {notices.reduce((sum, n) => sum + (n.viewCount || 0), 0)}
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notices by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Academic">Academic</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Events">Events</option>
                  <option value="Examinations">Examinations</option>
                  <option value="Holidays">Holidays</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Notices Table/Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
          <div className="p-6 border-b border-purple-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Notices ({filteredNotices.length})</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Bulk Actions:</span>
                <button className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                  Archive Selected
                </button>
                <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                  Delete Selected
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-50 border-b border-purple-100">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Notice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Posted By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {filteredNotices.map((notice) => (
                    <tr key={notice._id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="flex items-center space-x-2 mb-1">
                            {notice.isPinned && <Pin className="w-4 h-4 text-blue-500" />}
                            <h3 className="text-sm font-medium text-gray-900 truncate">{notice.title}</h3>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2">{notice.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{formatDate(notice.createdAt)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(notice.category)}`}>
                          {notice.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                          {notice.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(notice)}`}>
                          {getStatusText(notice)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {notice.postedBy?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {notice.viewCount || 0}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/notices/${notice._id}`}
                            className="p-1 text-purple-600 hover:text-purple-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/dashboard/notices/${notice._id}/edit`}
                            className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleNoticeAction(notice.isPinned ? 'unpin' : 'pin', notice._id)}
                            className="p-1 text-green-600 hover:text-green-700 transition-colors"
                          >
                            <Pin className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleNoticeAction('delete', notice._id)}
                            className="p-1 text-red-600 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotices.map((notice) => (
                  <div key={notice._id} className="bg-white border border-purple-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        {notice.isPinned && <Pin className="w-4 h-4 text-blue-500" />}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                          {notice.priority}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(notice)}`}>
                        {getStatusText(notice)}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{notice.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{notice.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{formatDate(notice.createdAt)}</span>
                      <span>{notice.viewCount || 0} views</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(notice.category)}`}>
                        {notice.category || 'General'}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Link
                          to={`/notices/${notice._id}`}
                          className="p-1 text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                        </Link>
                        <Link
                          to={`/notices/${notice._id}/edit`}
                          className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => handleNoticeAction('delete', notice._id)}
                          className="p-1 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredNotices.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-500">No notices found matching your criteria</p>
              <Link
                to="/notices/create"
                className="mt-4 inline-flex items-center text-purple-600 hover:text-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create new notice
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageNotices
