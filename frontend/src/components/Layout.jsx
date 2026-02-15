import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'

const Layout = () => {
  const { user } = useAuth()


  return (
    <div className="w-screen     min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-0">
        {/* <Navbar /> */}

        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
