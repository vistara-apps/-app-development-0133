import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  BarChart3, 
  Activity, 
  Brain, 
  Settings,
  User,
  Users,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Shield,
  Puzzle,
  CreditCard
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { ThemeToggle } from './ThemeToggle'
import { useThemeStore } from '../stores/themeStore'
import WellnessNotifications from './WellnessNotifications'

export function AppShell({ children }) {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { initTheme } = useThemeStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Initialize theme on component mount
  useEffect(() => {
    initTheme()
  }, [initTheme])

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Activities', href: '/', icon: Activity },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Insights', href: '/insights', icon: Brain },
    { name: 'Circles', href: '/circles', icon: Users },
    { name: 'Pricing', href: '/pricing', icon: CreditCard },
  ]

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 flex flex-col">
      {/* Header */}
              <header className={`sticky top-0 z-30 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 transition-shadow ${
        scrolled ? 'shadow-sm' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden p-2 mr-3 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                onClick={toggleMobileMenu}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
              
              {/* Logo */}
              <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                ResilientFlow
              </Link>
              
              {/* Desktop navigation */}
              <nav className="hidden md:flex ml-10 space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                    }`}
                    aria-current={location.pathname === item.href ? 'page' : undefined}
                  >
                    <item.icon className="w-4 h-4" aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <WellnessNotifications />
              
              {/* Theme toggle */}
              <ThemeToggle />
              
              {/* User menu */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  onClick={toggleUserMenu}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <User className="w-5 h-5" aria-hidden="true" />
                  <span className="hidden sm:inline text-sm font-medium">{user?.username}</span>
                  <span className="hidden sm:inline px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-sm text-xs font-medium">
                    {user?.subscriptionTier}
                  </span>
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </button>
                
                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg border border-gray-200 dark:border-neutral-700 py-1 z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.username}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" aria-hidden="true" />
                        Settings
                      </div>
                    </Link>
                    <Link
                      to="/settings/privacy"
                      className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2" aria-hidden="true" />
                        Privacy
                      </div>
                    </Link>
                    <Link
                      to="/integrations"
                      className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <Puzzle className="w-4 h-4 mr-2" aria-hidden="true" />
                        Integrations
                      </div>
                    </Link>
                    <button
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      onClick={() => {
                        setUserMenuOpen(false)
                        logout()
                      }}
                    >
                      <div className="flex items-center">
                        <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                        Sign out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden border-t border-neutral-200 dark:border-neutral-700"
            id="mobile-menu"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.href
                      ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                  }`}
                  aria-current={location.pathname === item.href ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative bg-white dark:bg-neutral-900 pb-20 md:pb-8 flex-1">
        {children}
      </main>

      {/* Mobile Navigation */}
              <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 px-4 py-2 z-20">
        <div className="flex justify-around">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center space-y-1 p-2 rounded-md ${
                location.pathname === item.href
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              aria-current={location.pathname === item.href ? 'page' : undefined}
            >
              <item.icon className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
