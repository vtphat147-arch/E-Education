import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'https://e-education-be.onrender.com/api'

export interface RegisterData {
  email: string
  username: string
  password: string
  fullName?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    email: string
    username: string
    fullName?: string
    avatarUrl?: string
    bio?: string
    isAdmin: boolean
  }
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${baseURL}/auth/register`, data)
    return response.data
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${baseURL}/auth/login`, data)
    return response.data
  },

  // Store token in localStorage
  setToken(token: string) {
    localStorage.setItem('auth_token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('auth_token')
  },

  // Remove token
  removeToken() {
    localStorage.removeItem('auth_token')
    delete axios.defaults.headers.common['Authorization']
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getToken() !== null
  }
}

// Set up axios interceptor to include token in requests
axios.interceptors.request.use(
  (config) => {
    const token = authService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

