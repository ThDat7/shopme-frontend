import { API_ENDPOINTS } from '../config/appConfig'
import {
  ProductDetailResponse,
  ProductListParams,
  ProductListResponse,
} from '../types/productTypes'
import { BaseService } from './baseService'

class ProductService extends BaseService {
  async listByPage(params: ProductListParams) {
    try {
      const response = await this.getPaginated<ProductListResponse>(
        API_ENDPOINTS.PRODUCTS,
        params
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getProductById(id: number) {
    try {
      const response = await this.get<ProductDetailResponse>(
        `${API_ENDPOINTS.PRODUCTS}/${id}`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async listBestSeller(params: ProductListParams) {
    try {
      const response = await this.getPaginated<ProductListResponse>(
        `${API_ENDPOINTS.PRODUCTS}/best-seller`,
        params
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async listTrending(params: ProductListParams) {
    try {
      const response = await this.getPaginated<ProductListResponse>(
        `${API_ENDPOINTS.PRODUCTS}/trending`,
        params
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async listHighRated(params: ProductListParams) {
    try {
      const response = await this.getPaginated<ProductListResponse>(
        `${API_ENDPOINTS.PRODUCTS}/top-rated`,
        params
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async listDiscounted(params: ProductListParams) {
    try {
      const response = await this.getPaginated<ProductListResponse>(
        `${API_ENDPOINTS.PRODUCTS}/top-discounted`,
        params
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export default new ProductService()
