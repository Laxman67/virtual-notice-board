import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { memo, useCallback } from 'react'
import {
  Calendar,
  Eye,
  Edit,
  Trash2,
  Pin,
  Tag,
  Clock,
  User,
  Mail,
  GraduationCap,
  Award,
  Shield
} from 'lucide-react'
import { formatDate, getPriorityColor, canEditNotice, canDeleteNotice } from '../utils/helpers'

// Get role-based styling for the notice card
const getRoleBasedStyling = (postedBy) => {
  if (!postedBy?.role) return 'border-gray-200 bg-white'

  switch (postedBy.role) {
    case 'ADMIN':
      return 'border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50'
    case 'FACULTY':
      return 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50'
    case 'STUDENT':
      return 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50'
    default:
      return 'border-gray-200 bg-white'
  }
}

// Get role-based badge styling
const getRoleBadgeStyling = (postedBy) => {
  if (!postedBy?.role) return 'bg-gray-100 text-gray-800'

  switch (postedBy.role) {
    case 'ADMIN':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'FACULTY':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'STUDENT':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Role icon component
const RoleIcon = ({ postedBy }) => {
  if (!postedBy?.role) return <User className="w-3 h-3" />

  switch (postedBy.role) {
    case 'ADMIN':
      return <Shield className="w-3 h-3" />
    case 'FACULTY':
      return <Award className="w-3 h-3" />
    case 'STUDENT':
      return <GraduationCap className="w-3 h-3" />
    default:
      return <User className="w-3 h-3" />
  }
}

const NoticeCard = ({ notice, onDelete, onEdit }) => {
  const { user } = useAuth()

  const handleDelete = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      onDelete(notice._id)
    }
  }, [notice._id, onDelete])

  const canEdit = canEditNotice(user, notice)
  const canDelete = canDeleteNotice(user, notice)

  const roleStyling = getRoleBasedStyling(notice.postedBy)
  const roleBadgeStyling = getRoleBadgeStyling(notice.postedBy)

  return (
    <div className={`rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${roleStyling}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
            {notice.priority}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {notice.category || 'General'}
          </span>
          {/* Role Badge */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleBadgeStyling}`}>
            <RoleIcon postedBy={notice.postedBy} />
            <span className="ml-1">{notice.postedBy?.role || 'User'}</span>
          </span>
          {notice.isPinned && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Pin className="w-3 h-3 mr-1" />
              Pinned
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          {canEdit && (
            <button
              onClick={() => onEdit && onEdit(notice)}
              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit notice"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete notice"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        <Link
          to={`/notices/${notice._id}`}
          className="hover:text-blue-600 transition-colors"
        >
          {notice.title}
        </Link>

      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {notice.description}
      </p>

      {/* Tags */}
      {notice.tags && notice.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {notice.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
            >
              #{tag}
            </span>
          ))}
          {notice.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
              +{notice.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(notice.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{notice.viewCount || 0} views</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {notice.expiresAt && (
            <div className="flex items-center space-x-1 text-yellow-600">
              <Clock className="w-3 h-3" />
              <span>Expires {formatDate(notice.expiresAt)}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <RoleIcon postedBy={notice.postedBy} />
            <span>{notice.postedBy?.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail className="w-3 h-3" />
            <span>{notice.postedBy?.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(NoticeCard)
