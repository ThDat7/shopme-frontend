import { BaseService } from './baseService'
import {
  CategoryListResponse,
  CategoryDetailResponse,
  CategorySelectResponse,
  CategorySearchResponse,
  CategoryExportResponse,
  CategoryListParams,
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from '../types/categoryTypes'
import { API_ENDPOINTS } from '../config/appConfig'
import { ExportUtils } from '../utils/exportUtils'

class CategoryService extends BaseService {
  async listByPage(params: CategoryListParams): Promise<{
    content: CategoryListResponse[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  }> {
    try {
      const response = await this.getPaginated<CategoryListResponse>(
        API_ENDPOINTS.CATEGORIES,
        params
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async search(params: CategoryListParams): Promise<{
    content: CategorySearchResponse[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  }> {
    try {
      const response = await this.getPaginated<CategorySearchResponse>(
        `${API_ENDPOINTS.CATEGORIES}/search`,
        params
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getCategoryById(id: number): Promise<CategoryDetailResponse> {
    try {
      const response = await this.get<CategoryDetailResponse>(
        `${API_ENDPOINTS.CATEGORIES}/${id}`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async createCategory(
    data: CategoryCreateRequest
  ): Promise<CategoryDetailResponse> {
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append(
        'alias',
        data.alias || data.name.toLowerCase().replace(/\s+/g, '-')
      )
      formData.append('enabled', String(data.enabled))

      if (data.parentID) {
        formData.append('parentID', String(data.parentID))
      }

      if (data.image) {
        formData.append('image', data.image)
      }

      const response = await this.post<CategoryDetailResponse>(
        API_ENDPOINTS.CATEGORIES,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async updateCategory(
    id: number,
    data: CategoryUpdateRequest
  ): Promise<CategoryDetailResponse> {
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append(
        'alias',
        data.alias || data.name.toLowerCase().replace(/\s+/g, '-')
      )
      formData.append('enabled', String(data.enabled))

      if (data.parentID) {
        formData.append('parentID', String(data.parentID))
      }

      if (data.image) {
        formData.append('image', data.image)
      }

      const response = await this.put<CategoryDetailResponse>(
        `${API_ENDPOINTS.CATEGORIES}/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await this.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`)
    } catch (error) {
      return this.handleError(error)
    }
  }

  async updateCategoryStatus(id: number, status: boolean): Promise<void> {
    try {
      await this.put(`${API_ENDPOINTS.CATEGORIES}/${id}/enable/${status}`)
    } catch (error) {
      return this.handleError(error)
    }
  }

  async listChildren(id: number): Promise<CategoryListResponse[]> {
    try {
      const response = await this.get<CategoryListResponse[]>(
        `${API_ENDPOINTS.CATEGORIES}/${id}/children`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getAllInForm(): Promise<CategorySelectResponse[]> {
    try {
      const response = await this.get<CategorySelectResponse[]>(
        `${API_ENDPOINTS.CATEGORIES}/all-in-form`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async listAllForExport(): Promise<CategoryExportResponse[]> {
    try {
      const response = await this.get<CategoryExportResponse[]>(
        `${API_ENDPOINTS.CATEGORIES}/all`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  exportToCSV(data: CategoryExportResponse[], filename: string): void {
    ExportUtils.exportToCSV(data, filename, [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'alias', label: 'Alias' },
      { key: 'enabled', label: 'Enabled' },
      { key: 'parentName', label: 'Parent Category' },
    ])
  }

  exportToExcel(data: CategoryExportResponse[], filename: string): void {
    ExportUtils.exportToExcel(data, filename, [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'alias', label: 'Alias' },
      { key: 'enabled', label: 'Enabled' },
      { key: 'parentName', label: 'Parent Category' },
    ])
  }

  exportToPDF(data: CategoryExportResponse[], filename: string): void {
    ExportUtils.exportToPDF(data, filename, [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'alias', label: 'Alias' },
      { key: 'enabled', label: 'Enabled' },
      { key: 'parentName', label: 'Parent Category' },
    ])
  }
}

export const categoryService = new CategoryService()
