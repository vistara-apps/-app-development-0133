import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import * as authService from '../services/authService'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Initialize auth state from Supabase session
      initializeAuth: async () => {
        set({ isLoading: true, error: null })
        
        try {
          if (!isSupabaseConfigured()) {
            // Use mock data if Supabase is not configured
            set({
              user: {
                id: 'demo-user-1',
                email: 'demo@resilientflow.com',
              },
              profile: {
                id: 'demo-user-1',
                username: 'Demo User',
                onboarding_completed: true,
                subscription_tier: 'free',
                created_at: new Date().toISOString()
              },
              isAuthenticated: true,
              isLoading: false
            })
            return
          }

          // Get current session
          const { session, error: sessionError } = await authService.getCurrentSession()
          
          if (sessionError) {
            throw sessionError
          }

          if (session) {
            const { user, error: userError } = await authService.getCurrentUser()
            
            if (userError) {
              throw userError
            }

            if (user) {
              // Get user profile
              const { profile, error: profileError } = await authService.getUserProfile(user.id)
              
              if (profileError && profileError.code !== 'PGRST116') { // Not found is ok
                console.warn('Error fetching profile:', profileError)
              }

              set({
                user,
                profile: profile || {
                  id: user.id,
                  username: user.email?.split('@')[0] || 'User',
                  onboarding_completed: false,
                  subscription_tier: 'free'
                },
                isAuthenticated: true,
                isLoading: false
              })
            } else {
              set({ user: null, profile: null, isAuthenticated: false, isLoading: false })
            }
          } else {
            set({ user: null, profile: null, isAuthenticated: false, isLoading: false })
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({ error: error.message, isLoading: false })
        }
      },

      // Sign up a new user
      signUp: async (email, password, metadata = {}) => {
        set({ isLoading: true, error: null })
        
        try {
          const { user, error } = await authService.signUp(email, password, metadata)
          
          if (error) {
            throw error
          }

          if (user) {
            // Get user profile
            const { profile } = await authService.getUserProfile(user.id)
            
            set({
              user,
              profile: profile || {
                id: user.id,
                username: metadata.username || email.split('@')[0],
                onboarding_completed: false,
                subscription_tier: 'free'
              },
              isAuthenticated: true,
              isLoading: false
            })
          }
        } catch (error) {
          console.error('Sign up error:', error)
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      // Sign in an existing user
      signIn: async (email, password) => {
        set({ isLoading: true, error: null })
        
        try {
          const { user, error } = await authService.signIn(email, password)
          
          if (error) {
            throw error
          }

          if (user) {
            // Get user profile
            const { profile, error: profileError } = await authService.getUserProfile(user.id)
            
            if (profileError && profileError.code !== 'PGRST116') { // Not found is ok
              console.warn('Error fetching profile:', profileError)
            }

            set({
              user,
              profile: profile || {
                id: user.id,
                username: user.email?.split('@')[0] || 'User',
                onboarding_completed: false,
                subscription_tier: 'free'
              },
              isAuthenticated: true,
              isLoading: false
            })
          }
        } catch (error) {
          console.error('Sign in error:', error)
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      // Sign out the current user
      signOut: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const { error } = await authService.signOut()
          
          if (error) {
            throw error
          }

          set({ user: null, profile: null, isAuthenticated: false, isLoading: false })
        } catch (error) {
          console.error('Sign out error:', error)
          set({ error: error.message, isLoading: false })
        }
      },

      // Update user profile
      updateProfile: async (updates) => {
        set({ isLoading: true, error: null })
        
        try {
          const { id } = get().user || {}
          
          if (!id) {
            throw new Error('User not authenticated')
          }

          const { profile, error } = await authService.updateUserProfile(id, updates)
          
          if (error) {
            throw error
          }

          set({
            profile,
            isLoading: false
          })
        } catch (error) {
          console.error('Update profile error:', error)
          set({ error: error.message, isLoading: false })
        }
      },

      // Legacy methods for backward compatibility
      login: (userData) => {
        console.warn('login() is deprecated, use signIn() instead')
        set({ 
          user: { id: userData.userId, email: userData.email },
          profile: {
            id: userData.userId,
            username: userData.username,
            onboarding_completed: userData.onboardingCompleted,
            subscription_tier: userData.subscriptionTier,
            created_at: userData.createdAt
          },
          isAuthenticated: true 
        })
      },
      logout: () => {
        console.warn('logout() is deprecated, use signOut() instead')
        get().signOut()
      },
      updateUser: (updates) => {
        console.warn('updateUser() is deprecated, use updateProfile() instead')
        set((state) => ({ 
          profile: { ...state.profile, ...updates } 
        }))
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

// Set up auth state change listener
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      const store = useAuthStore.getState()
      store.initializeAuth()
    } else if (event === 'SIGNED_OUT') {
      useAuthStore.setState({ user: null, profile: null, isAuthenticated: false })
    }
  })
}
