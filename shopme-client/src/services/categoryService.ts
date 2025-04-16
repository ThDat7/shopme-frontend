import { API_ENDPOINTS } from '../config/appConfig'
import { CategoryResponse, CategoryListParams } from '../types/categoryTypes'
import { BaseService } from './baseService'

class CategoryService extends BaseService {
  async getChildCategoryById(id: number){
    try {
      const response = await this.get<CategoryResponse[]>(
        `${API_ENDPOINTS.CATEGORIES}/${id}/children`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }
  
  async getCategoryById(id: number): Promise<CategoryResponse | null> {
    try {
      const response = await this.get<CategoryResponse>(
        `${API_ENDPOINTS.CATEGORIES}/${id}`
      )
      return response.result
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error)
      return null
    }
  }
  
  async getRootCategories(params: CategoryListParams) {
    try {
      const response = await this.getPaginated<CategoryResponse>(
        `${API_ENDPOINTS.CATEGORIES}/root`,
        params
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export default new CategoryService()
