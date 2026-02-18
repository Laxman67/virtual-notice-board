import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { noticeAPI } from '../api'
import {
  Calendar,
  Eye,
  Edit,
  Trash2,
  User,
  Tag,
  Clock,
  ArrowLeft,
  AlertCircle
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate, formatDateTime, getPriorityColor, canEditNotice, canDeleteNotice } from '../utils/helpers'

const NoticeDetail = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await noticeAPI.getNotice(id)

        setNotice(response.data.data.notice)
      } catch (error) {
        console.error('Failed to fetch notice:', error)
        setError(error.response?.data?.message || 'Failed to fetch notice')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchNotice()
    }
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this notice? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      await noticeAPI.deleteNotice(id)
      navigate('/notices')
    } catch (error) {
      console.error('Failed to delete notice:', error)
      alert('Failed to delete notice')
    } finally {
      setIsDeleting(false)
    }
  }

  const canEdit = notice && canEditNotice(user, notice)
  const canDelete = notice && canDeleteNotice(user, notice)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !notice) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Notice Not Found</h2>
        <p className="text-gray-600 mb-4">{error || 'The notice you are looking for does not exist.'}</p>
        <Link
          to="/notices"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notices
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Link
            to="/notices"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notices
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{notice.title}</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {canEdit && (
            <Link
              to={`/notices/${notice._id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Notice Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {/* Meta Information */}
          <div className="flex items-center space-x-4 mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(notice.priority)}`}>
              {notice.priority}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {notice.category || 'General'}
            </span>
            {notice.isPinned && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                📌 Pinned
              </span>
            )}
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{notice.description}</p>
          </div>

          {/* Tags */}
          {notice.tags && notice.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {notice.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notice Details */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Notice Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Posted by: <span className="font-medium text-gray-900">{notice.postedBy?.name}</span></span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Created: <span className="font-medium text-gray-900">{formatDateTime(notice.createdAt)}</span></span>
                  </div>
                  {notice.expiresAt && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Expires: <span className="font-medium text-gray-900">{formatDateTime(notice.expiresAt)}</span></span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Eye className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Views: <span className="font-medium text-gray-900">{notice.viewCount || 0}</span></span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Target Audience</h3>
                <div className="space-y-2">
                  {notice.targetAudience?.map((audience, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        {audience}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoticeDetail
