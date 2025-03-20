import {
  LoginRequest,
  LoginResponse,
  GoogleLoginRequest,
  CustomerInfo,
} from '../types/auth'
import { API_ENDPOINTS } from '../config/appConfig'
import { BaseService } from './baseService'
import axios from 'axios'

class AuthService extends BaseService {
  async login(data: LoginRequest) {
    try {
      const response = await this.post<LoginResponse>(
        `${API_ENDPOINTS.AUTH}/login`,
        data
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async loginWithGoogle(data: GoogleLoginRequest) {
    try {
      const response = await this.post<LoginResponse>(
        `${API_ENDPOINTS.AUTH}/google`,
        data
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      await this.post<void>(`${API_ENDPOINTS.AUTH}/logout`)
      localStorage.removeItem('userInfo')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      localStorage.removeItem('token')
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  setToken(token: string): void {
    localStorage.setItem('token', token)
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  getCustomerInfo(): CustomerInfo | null {
    const userInfo = localStorage.getItem('userInfo')
    return userInfo ? JSON.parse(userInfo) : null
  }

  setupAxiosInterceptors() {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }
}

export default new AuthService()
