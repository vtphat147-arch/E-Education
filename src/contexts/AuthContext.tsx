import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService, AuthResponse } from '../services/authService'
import { RegisterData, LoginData } from '../services/authService'

interface AuthContextType {
  user: AuthResponse['user'] | null
  loading: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  googleLogin: (idToken: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const loadUser = async () => {
      const token = authService.getToken()
      if (token) {
        try {
          // Try to get user profile to verify token
          const { userService } = await import('../services/userService')
          const profile = await userService.getProfile()
          setUser({
            id: profile.id,
            email: profile.email,
            username: profile.username,
            fullName: profile.fullName,
            avatarUrl: profile.avatarUrl,
            bio: profile.bio,
            isAdmin: profile.isAdmin,
            isVip: profile.isVip,
            vipExpiresAt: profile.vipExpiresAt,
            daysRemaining: profile.daysRemaining
          })
        } catch (error) {
          // Token is invalid, remove it
          authService.removeToken()
        }
      }
      setLoading(false)
    }
    
    loadUser()
  }, [])

  const login = async (data: LoginData) => {
    const response = await authService.login(data)
    authService.setToken(response.token)
    setUser(response.user)
  }

  const register = async (data: RegisterData) => {
    const response = await authService.register(data)
    authService.setToken(response.token)
    setUser(response.user)
  }

  const googleLogin = async (idToken: string) => {
    const response = await authService.googleLogin(idToken)
    authService.setToken(response.token)
    setUser(response.user)
  }

  const logout = () => {
    authService.removeToken()
    setUser(null)
  }

  const refreshUser = async () => {
    const token = authService.getToken()
    if (!token) return
    
    try {
      const { userService } = await import('../services/userService')
      const profile = await userService.getProfile()
      setUser({
        id: profile.id,
        email: profile.email,
        username: profile.username,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
        bio: profile.bio,
        isAdmin: profile.isAdmin,
        isVip: profile.isVip,
        vipExpiresAt: profile.vipExpiresAt,
        daysRemaining: profile.daysRemaining
      })
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        refreshUser,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

