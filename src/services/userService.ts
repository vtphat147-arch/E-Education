import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'https://e-education-be.onrender.com/api'

export interface UserProfile {
  id: number
  email: string
  username: string
  fullName?: string
  avatarUrl?: string
  bio?: string
  isAdmin: boolean
}

export interface UpdateProfileData {
  username?: string
  fullName?: string
  bio?: string
  avatarUrl?: string
}

export interface Favorite {
  id: number
  componentId: number
  component: {
    id: number
    name: string
    category: string
    type: string
    preview: string
    description: string
    views: number
    likes: number
  }
  createdAt: string
}

export interface ViewHistoryItem {
  id: number
  componentId: number
  component: {
    id: number
    name: string
    category: string
    type: string
    preview: string
    description: string
    views: number
    likes: number
  }
  viewedAt: string
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await axios.get<UserProfile>(`${baseURL}/users/me`)
    return response.data
  },

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await axios.put<UserProfile>(`${baseURL}/users/me`, data)
    return response.data
  },

  async getFavorites(): Promise<Favorite[]> {
    const response = await axios.get<Favorite[]>(`${baseURL}/favorites`)
    return response.data
  },

  async addFavorite(componentId: number): Promise<void> {
    await axios.post(`${baseURL}/favorites/${componentId}`)
  },

  async removeFavorite(componentId: number): Promise<void> {
    await axios.delete(`${baseURL}/favorites/${componentId}`)
  },

  async checkFavorite(componentId: number): Promise<boolean> {
    const response = await axios.get<{ isFavorited: boolean }>(`${baseURL}/favorites/${componentId}/check`)
    return response.data.isFavorited
  },

  async getViewHistory(page = 1, pageSize = 20): Promise<{
    data: ViewHistoryItem[]
    page: number
    pageSize: number
    total: number
    totalPages: number
  }> {
    const response = await axios.get(`${baseURL}/viewhistory`, {
      params: { page, pageSize }
    })
    return response.data
  }
}

