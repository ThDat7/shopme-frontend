import { PaginationParams } from '../types/commonTypes'
import { BaseService } from './baseService'
import { ProductReviewResponse } from '../types/reviewTypes'
import { API_ENDPOINTS } from '../config/appConfig'

class ReviewService extends BaseService {
  async getProductReviews(productId: number, params: PaginationParams = { page: 0, size: 10 }) {
    try {
      const response = await this.getPaginated<ProductReviewResponse>(
        `${API_ENDPOINTS.REVIEWS}/product/${productId}`, 
        params
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export default new ReviewService()
