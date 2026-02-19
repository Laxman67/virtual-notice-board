import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { noticeAPI } from '../api'
import NoticeCard from '../components/NoticeCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Search, Plus, MonitorStop } from 'lucide-react'
import { CATEGORIES, PRIORITIES } from '../utils/constants'
import { debounce } from '../utils/helpers'

const Notices = () => {
  const { user } = useAuth()
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = {
        search: searchTerm || '',
        category: selectedCategory,
        priority: selectedPriority,
        sortBy,
        sortOrder,
        page: 1,
        limit: 50
      }

      const response = await noticeAPI.getNotices(params)
      setNotices(response.data.data.notices || [])
    } catch (error) {
      console.error('Failed to fetch notices:', error)
      setError(error.response?.data?.message || 'Failed to fetch notices')
      setNotices([])
    } finally {
      setLoading(false)
    }
  }, [searchTerm, selectedCategory, selectedPriority, sortBy, sortOrder])

  // Debounced search function
  const debouncedFetchNotices = useMemo(
    () => debounce(fetchNotices, 500),
    [fetchNotices]
  )

  useEffect(() => {
    debouncedFetchNotices()

    // Cleanup debounce on unmount
    return () => {
      debouncedFetchNotices.cancel?.()
    }
  }, [debouncedFetchNotices])

  const handleDelete = useCallback(async (noticeId) => {
    try {
      await noticeAPI.deleteNotice(noticeId)
      setNotices(prev => prev.filter(notice => notice._id !== noticeId))
    } catch (error) {
      console.error('Failed to delete notice:', error)
      alert('Failed to delete notice')
    }
  }, [])

  const handleEdit = useCallback((notice) => {
    // Navigate to edit page
    window.location.href = `/notices/${notice._id}/edit`
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedPriority('')
    setSortBy('createdAt')
    setSortOrder('desc')
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading notices</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
          <p className="text-gray-600">
            Browse and manage all notices
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Priorities</option>
              {PRIORITIES.map(priority => (
                <option key={priority.value} value={priority.value}>{priority.label}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-')
                setSortBy(sort)
                setSortOrder(order)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedCategory || selectedPriority) && (
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                Search: {searchTerm}
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                Category: {selectedCategory}
              </span>
            )}
            {selectedPriority && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                Priority: {selectedPriority}
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {notices.length} {notices.length === 1 ? 'Notice' : 'Notices'} Found
          </h2>
        </div>

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
          <div className="divide-y divide-gray-200">
            {notices.map((notice) => (
              <NoticeCard
                key={notice._id}
                notice={notice}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notices
