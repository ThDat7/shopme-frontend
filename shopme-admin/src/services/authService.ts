import axios from 'axios'
import {
  AuthenticationRequest,
  AuthenticationResponse,
  IntrospectResponse,
  UserProfile,
} from '../types/authTypes'
import { ApiResponse } from '../types/userTypes'

const API_BASE_HOST = 'http://localhost:8080'
const API_BASE_URL = `${API_BASE_HOST}/api/auth`
const USER_API_URL = `${API_BASE_HOST}/api/v1/users`

export const authService = {
  login: async (
    credentials: AuthenticationRequest
  ): Promise<ApiResponse<AuthenticationResponse>> => {
    const response = await axios.post(`${API_BASE_URL}/token`, credentials)
    const { data } = response
    if (data.result.authenticated) {
      localStorage.setItem('token', data.result.token)
      localStorage.setItem('userInfo', JSON.stringify(data.result.userInfo))
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${data.result.token}`
    }
    return data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    delete axios.defaults.headers.common['Authorization']
  },

  introspect: async (
    token: string
  ): Promise<ApiResponse<IntrospectResponse>> => {
    const response = await axios.post(`${API_BASE_URL}/introspect`, { token })
    return response.data
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = localStorage.getItem('token')
    if (!token) return false

    try {
      const response = await authService.introspect(token)
      return response.result.valid
    } catch {
      authService.logout()
      return false
    }
  },

  getUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo')
    // return userInfo ? JSON.parse(userInfo) : null
    return null
  },

  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    const response = await axios.get(`${USER_API_URL}/profile`)
    return response.data
  },

  updateProfile: async (data: FormData): Promise<ApiResponse<void>> => {
    const response = await axios.put(`${USER_API_URL}/profile`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  setupAxiosInterceptors: () => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          authService.logout()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  },
}
