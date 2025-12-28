import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService, AuthResponse } from '../services/authService'
import { RegisterData, LoginData } from '../services/authService'

interface AuthContextType {
  user: AuthResponse['user'] | null
  loading: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = authService.getToken()
    if (token) {
      // Token exists, try to get user info (we'll implement this later)
      // For now, just set loading to false
      setLoading(false)
    } else {
      setLoading(false)
    }
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

  const logout = () => {
    authService.removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
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

