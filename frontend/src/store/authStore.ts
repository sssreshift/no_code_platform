import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '@/services/api'
import type { AuthState, User, RegisterData } from '@/types'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          console.log('Attempting login for:', email)
          const response = await authApi.login({ email, password })
          const { access_token } = response
          
          console.log('Login successful, token received:', access_token ? 'Yes' : 'No')
          
          // Store token in both localStorage and state
          localStorage.setItem('token', access_token)
          
          // Get user info
          const user = await authApi.getCurrentUser()
          console.log('User info retrieved:', user)

          // Persist user for initializeAuth compatibility
          localStorage.setItem('user', JSON.stringify(user))
          
          set({
            user,
            token: access_token,
            isAuthenticated: true,
          })
          
          console.log('Auth state updated successfully')
        } catch (error: any) {
          console.error('Login failed:', error)
          throw new Error(error.response?.data?.detail || 'Login failed')
        }
      },

      register: async (data: RegisterData) => {
        try {
          const user = await authApi.register(data)
          
          // Auto-login after successful registration
          await get().login(data.email, data.password)
        } catch (error: any) {
          console.error('Registration failed:', error)
          throw new Error(error.response?.data?.detail || 'Registration failed')
        }
      },

      logout: () => {
        console.log('Logging out user')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      // Initialize auth state from localStorage on app start
      initializeAuth: () => {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr)
            console.log('Initializing auth from localStorage:', { token: token ? 'Present' : 'Missing', user })
            set({
              user,
              token,
              isAuthenticated: true,
            })
          } catch (error) {
            console.error('Error parsing user from localStorage:', error)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
