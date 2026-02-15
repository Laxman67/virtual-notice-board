import { format } from 'date-fns'

export const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}

export const formatDateTime = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
}

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'URGENT': return 'bg-red-100 text-red-800 border-red-200'
    case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'MEDIUM': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'LOW': return 'bg-gray-100 text-gray-800 border-gray-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const canEditNotice = (user, notice) => {
  return user?.role === 'ADMIN' || notice.postedBy?._id === user?._id
}

export const canDeleteNotice = (user, notice) => {
  return user?.role === 'ADMIN' || notice.postedBy?._id === user?._id
}

export const debounce = (func, delay) => {
  let timeoutId
  const debounced = (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }

  debounced.cancel = () => {
    clearTimeout(timeoutId)
  }

  return debounced
}
