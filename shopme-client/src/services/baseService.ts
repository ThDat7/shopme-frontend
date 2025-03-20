import axios, { AxiosInstance } from 'axios'
import { API_BASE_URL, API_ENDPOINTS } from '../config/appConfig'
import {
  ApiResponse,
  PaginationParams,
  PaginationResponse,
} from '../types/commonTypes'

export class BaseService {
  protected api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    // Add request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Add response interceptor
    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  protected async get<T>(
    url: string,
    params?: any,
    config?: any
  ): Promise<ApiResponse<T>> {
    return this.api.get(url, { params, ...config })
  }

  protected async post<T>(
    url: string,
    data?: any,
    config?: any
  ): Promise<ApiResponse<T>> {
    return this.api.post(url, data, config)
  }

  protected async put<T>(
    url: string,
    data?: any,
    config?: any
  ): Promise<ApiResponse<T>> {
    return this.api.put(url, data, config)
  }

  protected async delete<T>(
    url: string,
    config?: any
  ): Promise<ApiResponse<T>> {
    return this.api.delete(url, config)
  }

  protected async getPaginated<T>(
    url: string,
    params: PaginationParams,
    config?: any
  ): Promise<ApiResponse<PaginationResponse<T>>> {
    return this.api.get(url, { params, ...config })
  }

  protected handleError(error: any): never {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('An unexpected error occurred')
  }
}
