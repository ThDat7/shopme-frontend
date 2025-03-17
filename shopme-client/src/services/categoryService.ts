import { API_ENDPOINTS } from '../config/appConfig'
import { CategoryResponse, ListCategoryResponse } from '../types/categoryTypes'
import { BaseService } from './baseService'

class CategoryService extends BaseService {
  async getChildCategoryById(id: number): Promise<ListCategoryResponse> {
    try {
      const response = await this.get<ListCategoryResponse>(
        `${API_ENDPOINTS.CATEGORIES}/${id}/children`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getLeafCategories(): Promise<CategoryResponse[]> {
    try {
      const response = await this.get<CategoryResponse[]>(
        `${API_ENDPOINTS.CATEGORIES}/leaf-categories`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export default new CategoryService()
