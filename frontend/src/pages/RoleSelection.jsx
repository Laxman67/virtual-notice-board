import { Link } from 'react-router-dom'
import { GraduationCap, Award, Shield, ArrowRight } from 'lucide-react'

const RoleSelection = () => {
  const roles = [
    {
      title: 'Student',
      description: 'Access notices, academic updates, and campus information',
      icon: GraduationCap,
      color: 'blue',
      loginPath: '/login/student',
      registerPath: '/register/student',
      features: ['View notices', 'Academic resources', 'Campus updates', 'Event notifications']
    },
    {
      title: 'Faculty',
      description: 'Create and manage notices, academic content, and student communications',
      icon: Award,
      color: 'emerald',
      loginPath: '/login/faculty',
      registerPath: '/register/faculty',
      features: ['Create notices', 'Manage content', 'Student communication', 'Academic tools']
    },
    {
      title: 'Administrator',
      description: 'System administration, user management, and platform oversight',
      icon: Shield,
      color: 'purple',
      loginPath: '/login/admin',
      registerPath: '/register/admin',
      features: ['User management', 'System settings', 'Platform oversight', 'Advanced analytics']
    }
  ]

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'from-blue-500 to-indigo-600',
        hover: 'hover:from-blue-600 hover:to-indigo-700',
        text: 'text-blue-600',
        border: 'border-blue-200',
        lightBg: 'bg-blue-50'
      },
      emerald: {
        bg: 'from-emerald-500 to-teal-600',
        hover: 'hover:from-emerald-600 hover:to-teal-700',
        text: 'text-emerald-600',
        border: 'border-emerald-200',
        lightBg: 'bg-emerald-50'
      },
      purple: {
        bg: 'from-purple-500 to-pink-600',
        hover: 'hover:from-purple-600 hover:to-pink-700',
        text: 'text-purple-600',
        border: 'border-purple-200',
        lightBg: 'bg-purple-50'
      }
    }
    return colorMap[color]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full shadow-lg">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">NB</span>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
            Virtual Notice Board
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Welcome to our unified academic communication platform
          </p>
          <p className="text-lg text-gray-500">
            Please select your role to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {roles.map((role, index) => {
            const colors = getColorClasses(role.color)
            const Icon = role.icon
            
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative p-8">
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${colors.bg} mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className={`text-2xl font-bold text-gray-900 mb-3`}>
                    {role.title} Portal
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {role.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {role.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-500">
                        <div className={`w-2 h-2 rounded-full ${colors.text} mr-2`}></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <Link
                      to={role.loginPath}
                      className={`w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r ${colors.bg} ${colors.hover} text-white font-medium rounded-xl transition-all transform hover:scale-[1.02] shadow-md`}
                    >
                      Sign In as {role.title}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                    
                    <Link
                      to={role.registerPath}
                      className={`w-full flex items-center justify-center px-4 py-3 border ${colors.border} ${colors.text} font-medium rounded-xl hover:${colors.lightBg} transition-all`}
                    >
                      Register as {role.title}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Secure Authentication
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Role-Based Access
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Real-time Updates
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
