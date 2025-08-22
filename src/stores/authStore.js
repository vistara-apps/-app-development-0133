import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: {
    userId: 'demo-user-1',
    email: 'demo@resilientflow.com',
    username: 'Demo User',
    onboardingCompleted: true,
    subscriptionTier: 'free',
    createdAt: new Date().toISOString()
  },
  isAuthenticated: true,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateUser: (updates) => set((state) => ({ 
    user: { ...state.user, ...updates } 
  })),
}))