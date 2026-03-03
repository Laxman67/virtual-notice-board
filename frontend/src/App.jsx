import { Routes, Route, Navigate, useParams } from 'react-router-dom'
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
import ManageUsers from './pages/ManageUsers'
import ManageNotices from './pages/ManageNotices'
import AdminSettings from './pages/AdminSettings'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminLayout from './components/AdminLayout'
import DashboardResetPassword from './pages/DashboardResetPassword'

// Wrapper component to handle notice redirect
const NoticeRedirect = () => {
  const { user } = useAuth()
  const { id } = useParams()

  if (user?.role === 'ADMIN' || user?.role === 'FACULTY') {
    return <Navigate to={`/dashboard/notices/${id}`} replace />
  }

  return <NoticeDetail />
}

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
        element={
          !user ?
            <Login /> :
            user?.role === 'ADMIN' ?
              <Navigate to="/dashboard" replace /> :
              <Navigate to="/dashboard" replace />
        }
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
        <Route
          path="notices"
          element={
            user?.role === 'ADMIN' || user?.role === 'FACULTY' ?
              <Navigate to="/dashboard/notices" replace /> :
              <Notices />
          }
        />
        <Route
          path="notices/:id"
          element={<NoticeRedirect />}
        />
        <Route
          path="profile"
          element={
            user?.role === 'ADMIN' ?
              <Navigate to="/dashboard/profile" replace /> :
              <Profile />
          }
        />

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

        {/* Faculty/Admin Routes */}
        <Route
          path="notices/:id"
          element={<NoticeDetail />}
        />
      </Route>

      {/* Admin Management Routes - Under Dashboard */}
      <Route path="/dashboard" element={<AdminLayout />}>
        <Route
          path=""
          element={
            user?.role === 'ADMIN' ?
              <AdminDashboard /> :
              user?.role === 'FACULTY' ?
                <FacultyDashboard /> :
                user?.role === 'STUDENT' ?
                  <StudentDashboard /> :
                  <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="users"
          element={
            user?.role === 'ADMIN' ?
              <ManageUsers /> :
              <Navigate to="/dashboard" replace />
          }
        />
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
        <Route
          path="notices/:id"
          element={
            user?.role === 'ADMIN' || user?.role === 'FACULTY' ?
              <NoticeDetail /> :
              <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="notices"
          element={
            (user?.role === 'ADMIN' || user?.role === 'FACULTY') ?
              <ManageNotices /> :
              user?.role === 'STUDENT' ?
                <Notices /> :
                <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="profile"
          element={
            (user?.role === 'ADMIN' || user?.role === 'FACULTY') ?
              <Profile /> :
              user?.role === 'STUDENT' ?
                <Profile /> :
                <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="settings"
          element={
            user?.role === 'ADMIN' ?
              <AdminSettings /> :
              <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="analytics"
          element={
            (() => {
              console.log('Analytics route accessed - user role:', user?.role);
              if (user?.role === 'ADMIN') {
                console.log('Rendering AdminAnalytics component');
                return <AdminAnalytics />;
              } else if (user?.role === 'FACULTY') {
                console.log('Rendering AdminAnalytics component for faculty');
                return <AdminAnalytics />;
              } else {
                console.log('Redirecting to dashboard - not admin/faculty');
                return <Navigate to="/dashboard" replace />;
              }
            })()
          }
        />
        <Route
          path="reset-password"
          element={
            user ? <DashboardResetPassword /> : <Navigate to="/login" replace />
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

        {/* Faculty/Admin Routes */}
        <Route
          path="notices/:id"
          element={<NoticeDetail />}
        />
      </Route>
    </Routes>
  )
}

export default App
