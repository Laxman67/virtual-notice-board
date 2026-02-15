import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Notices from './pages/Notices'
import NoticeDetail from './pages/NoticeDetail'
import CreateNotice from './pages/CreateNotice'
import EditNotice from './pages/EditNotice'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Root Route */}
      <Route
        path="/"
        element={!user ? <Navigate to="/login" replace /> : <Navigate to="/dashboard" replace />}
      />

      {/* Public Routes */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
      />

      {/* Protected Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="notices" element={<Notices />} />
        <Route path="notices/:id" element={<NoticeDetail />} />
        <Route path="profile" element={<Profile />} />

        {/* Faculty/Admin Routes */}
        <Route
          path="notices/create"
          element={
            (user?.role === 'FACULTY' || user?.role === 'ADMIN') ?
              <CreateNotice /> :
              <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="notices/:id/edit"
          element={
            (user?.role === 'FACULTY' || user?.role === 'ADMIN') ?
              <EditNotice /> :
              <Navigate to="/dashboard" replace />
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="admin"
          element={
            user?.role === 'ADMIN' ?
              <AdminDashboard /> :
              <Navigate to="/dashboard" replace />
          }
        />
      </Route>

      {/* Fallback Routes */}
      <Route path="" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
