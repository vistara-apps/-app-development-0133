import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  BarChart3, 
  Activity, 
  Brain, 
  Settings,
  User
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

export function AppShell({ children }) {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Activities', href: '/activities', icon: Activity },
    { name: 'Insights', href: '/insights', icon: Brain },
  ]

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface shadow-card border-b border-gray-200">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-primary">
                ResilientFlow
              </Link>
              <nav className="hidden md:flex space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-primary bg-primary/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <User className="w-4 h-4" />
                <span>{user?.username}</span>
                <span className="px-2 py-1 bg-accent/20 text-accent rounded-sm text-xs font-medium">
                  {user?.subscriptionTier}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-text-secondary hover:text-text-primary"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center space-y-1 p-2 rounded-md ${
                location.pathname === item.href
                  ? 'text-primary'
                  : 'text-text-secondary'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}