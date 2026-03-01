import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import './App.css'
import Layout from './components/Layout'
import RoleSelection from './pages/RoleSelection'
import Login from './pages/Login'
import StudentLogin from './pages/StudentLogin'
import FacultyLogin from './pages/FacultyLogin'
import AdminLogin from './pages/AdminLogin'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Register from './pages/Register'
import StudentRegister from './pages/StudentRegister'
import FacultyRegister from './pages/FacultyRegister'
import AdminRegister from './pages/AdminRegister'
import Dashboard from './pages/Dashboard'
import StudentDashboard from './pages/StudentDashboard'
import FacultyDashboard from './pages/FacultyDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Notices from './pages/Notices'
import NoticeDetail from './pages/NoticeDetail'
import CreateNotice from './pages/CreateNotice'
import EditNotice from './pages/EditNotice'
import Profile from './pages/Profile'
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
      {/* Root Route - Master Login */}
      <Route
        path="/"
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
      />

      {/* Role Selection */}
      <Route
        path="/select-role"
        element={!user ? <RoleSelection /> : <Navigate to="/dashboard" replace />}
      />

      {/* Original Login/Register Routes */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
      />

      {/* Password Reset Routes */}
      <Route
        path="/forgot-password"
        element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/reset-password"
        element={!user ? <ResetPassword /> : <Navigate to="/dashboard" replace />}
      />

      {/* Role-Specific Login Routes */}
      <Route
        path="/login/student"
        element={!user ? <StudentLogin /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/login/faculty"
        element={!user ? <FacultyLogin /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/login/admin"
        element={!user ? <AdminLogin /> : <Navigate to="/dashboard" replace />}
      />

      {/* Role-Specific Registration Routes */}
      <Route
        path="/register/student"
        element={!user ? <StudentRegister /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/register/faculty"
        element={!user ? <FacultyRegister /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/register/admin"
        element={!user ? <AdminRegister /> : <Navigate to="/dashboard" replace />}
      />

      {/* Protected Routes */}
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="notices" element={<Notices />} />
        <Route path="notices/:id" element={<NoticeDetail />} />
        <Route path="profile" element={<Profile />} />

        {/* Role-Specific Dashboard Routes */}
        <Route
          path="student-dashboard"
          element={
            user?.role === 'STUDENT' ?
              <StudentDashboard /> :
              <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="faculty-dashboard"
          element={
            (user?.role === 'FACULTY') ?
              <FacultyDashboard /> :
              <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="admin-dashboard"
          element={
            user?.role === 'ADMIN' ?
              <AdminDashboard /> :
              <Navigate to="/dashboard" replace />
          }
        />

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
      </Route>

      {/* Dashboard fallback */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Fallback Routes */}
      <Route path="" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
