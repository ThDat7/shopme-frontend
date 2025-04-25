import axios from 'axios'
import {
  AuthenticationRequest,
  AuthenticationResponse,
  IntrospectResponse,
  RefreshTokenResponse,
  UserProfile,
} from '../types/authTypes'
import { BaseService } from './baseService'
import { API_ENDPOINTS } from '../config/appConfig'

class AuthService extends BaseService {
  async login(credentials: AuthenticationRequest) {
    try {
      const response = await this.post<AuthenticationResponse>(
        `${API_ENDPOINTS.AUTH}/token`,
        credentials
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async logout() {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      delete axios.defaults.headers.common['Authorization']
    } catch (error) {
      return this.handleError(error)
    }
  }

  async introspect(token: string) {
    try {
      const response = await this.post<IntrospectResponse>(
        `${API_ENDPOINTS.AUTH}/introspect`,
        { token }
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async refreshToken() {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found for refresh')
      }

      const response = await this.post<RefreshTokenResponse>(
        `${API_ENDPOINTS.AUTH}/refresh`,
        { token }
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async isAuthenticated() {
    try {
      const token = localStorage.getItem('token')
      if (!token) return false
      const response = await this.introspect(token)
      return response.valid
    } catch (error) {
      return this.handleError(error)
    }
  }

  getUserInfo() {
    try {
      const userInfo = localStorage.getItem('userInfo')
      return userInfo ? JSON.parse(userInfo) : null
    } catch (error) {
      return this.handleError(error)
    }
  }

  async updateProfile(data: FormData) {
    try {
      const response = await this.put<void>(
        `${API_ENDPOINTS.USERS}/profile`,
        data
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getProfile() {
    try {
      const response = await this.get<UserProfile>(
        `${API_ENDPOINTS.USERS}/profile`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const authService = new AuthService()
