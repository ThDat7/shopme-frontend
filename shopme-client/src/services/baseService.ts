import axios, { AxiosInstance } from 'axios'
import { API_BASE_URL } from '../config/appConfig'
import {
  ApiResponse,
  PaginationParams,
  PaginationResponse,
} from '../types/commonTypes'
import { toast } from 'react-toastify'

export class BaseService {
  protected api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      // Thêm paramsSerializer để đảm bảo mảng được serialize đúng cách
      paramsSerializer: {
        serialize: (params) => {
          const searchParams = new URLSearchParams();
          
          // Xử lý đặc biệt cho mảng
          for (const key in params) {
            if (params[key] !== null && params[key] !== undefined) {
              if (Array.isArray(params[key])) {
                // Đối với mảng, chuyển thành chuỗi ngăn cách bởi dấu phẩy
                if (params[key].length > 0) {
                  searchParams.append(key, params[key].join(','));
                }
              } else {
                searchParams.append(key, params[key]);
              }
            }
          }
          
          return searchParams.toString();
        },
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

  // protected async post<R, T>(
  //   url: string,
  //   data: R,
  //   config?: any
  // ): Promise<ApiResponse<T>> {
  //   return this.api.post(url, data, config)
  // }

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
    let errorMessage = 'Đã xảy ra lỗi'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    toast.error(errorMessage)
    throw new Error(errorMessage)
  }
}
