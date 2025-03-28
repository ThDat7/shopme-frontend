import { GoogleLoginRequest, GoogleLoginResponse } from '../types/auth'
import { API_ENDPOINTS } from '../config/appConfig'
import { BaseService } from './baseService'
import axios from 'axios'
import { CustomerLoginRequest, CustomerLoginResponse } from '../types/auth'

class AuthService extends BaseService {
  async loginWithGoogle(data: GoogleLoginRequest) {
    try {
      const response = await this.post<GoogleLoginResponse>(
        `${API_ENDPOINTS.AUTH}/google`,
        data
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async login(credentials: CustomerLoginRequest) {
    try {
      const response = await this.post<CustomerLoginResponse>(
        `${API_ENDPOINTS.AUTH}/login`,
        credentials
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
}

const authService = new AuthService()
export default authService
