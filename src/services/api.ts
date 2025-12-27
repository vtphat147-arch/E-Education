/// <reference types="vite/client" />
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://e-education-be.onrender.com/api',
})

export const courseService = {
  getAllCourses: (search?: string, category?: string) => {
    return api.get('/courses', { 
      params: { search, category: category === 'all' ? undefined : category } 
    }).then(res => res.data)
  },
  
  getCourseById: (id: number) => {
    return api.get(`/courses/${id}`).then(res => res.data)
  },
}

