import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { userAPI } from '../api/admin'
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  ChevronDown,
  Download,
  Upload,
  Eye,
  AlertTriangle
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const ManageUsers = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [searchTerm, filterRole, filterStatus])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = {
        page: 1,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }

      if (searchTerm) params.search = searchTerm
      if (filterRole !== 'all') params.role = filterRole
      if (filterStatus !== 'all') params.status = filterStatus

      const response = await userAPI.getUsers(params)
      setUsers(response.data.data.users || [])
    } catch (error) {
      toast.error('Failed to fetch users')
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (action, userId) => {
    try {
      switch (action) {
        case 'activate':
          await userAPI.activateUser(userId)
          toast.success('User activated successfully')
          fetchUsers()
          break
        case 'deactivate':
          await userAPI.deactivateUser(userId)
          toast.success('User deactivated successfully')
          fetchUsers()
          break
        case 'delete':
          if (window.confirm('Are you sure you want to delete this user?')) {
            await userAPI.deleteUser(userId)
            toast.success('User deleted successfully')
            fetchUsers()
          }
          break
        case 'reset-password':
          await userAPI.resetPassword(userId)
          toast.success('Password reset link sent to user email')
          break
        default:
          break
      }
    } catch (error) {
      toast.error('Action failed')
      console.error('Error performing user action:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'FACULTY': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'STUDENT': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200'
      case 'suspended': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access user management.</p>
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
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  User Management
                </h1>
                <p className="text-gray-600">Manage system users and permissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
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
                placeholder="Search users by name or email..."
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
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="STUDENT">Student</option>
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
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
          <div className="p-6 border-b border-purple-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Users ({filteredUsers.length})</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Bulk Actions:</span>
                <button className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                  Activate Selected
                </button>
                <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                  Delete Selected
                </button>
              </div>
            </div>
          </div>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-purple-600 hover:text-purple-700 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-blue-600 hover:text-blue-700 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:text-green-700 transition-colors">
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-700 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageUsers
