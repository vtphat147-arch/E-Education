import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'https://e-education-be.onrender.com/api'

export interface Comment {
  id: number
  componentId: number
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: number
    username: string
    avatarUrl?: string
    fullName?: string
  }
}

export interface CommentsResponse {
  data: Comment[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface CreateCommentDto {
  content: string
}

export interface UpdateCommentDto {
  content: string
}

export const commentService = {
  async getComments(componentId: number, page = 1, pageSize = 20): Promise<CommentsResponse> {
    const response = await axios.get<CommentsResponse>(
      `${baseURL}/components/${componentId}/comments`,
      { params: { page, pageSize } }
    )
    return response.data
  },

  async createComment(componentId: number, dto: CreateCommentDto): Promise<Comment> {
    const response = await axios.post<Comment>(
      `${baseURL}/components/${componentId}/comments`,
      dto
    )
    return response.data
  },

  async updateComment(componentId: number, commentId: number, dto: UpdateCommentDto): Promise<Comment> {
    const response = await axios.put<Comment>(
      `${baseURL}/components/${componentId}/comments/${commentId}`,
      dto
    )
    return response.data
  },

  async deleteComment(componentId: number, commentId: number): Promise<void> {
    await axios.delete(`${baseURL}/components/${componentId}/comments/${commentId}`)
  }
}


