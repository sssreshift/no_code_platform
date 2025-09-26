import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const { user, token, isAuthenticated, login, register, logout, initializeAuth } = useAuthStore()

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    initializeAuth,
  }
}
