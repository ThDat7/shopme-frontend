import { BaseService } from './baseService'
import {
  BrandListResponse,
  BrandListParams,
  BrandCreateRequest,
  BrandUpdateRequest,
  BrandDetailResponse,
  BrandExportResponse,
} from '../types/brandTypes'

import { API_ENDPOINTS } from '../config/appConfig'
import { ExportUtils } from '../utils/exportUtils'

class BrandService extends BaseService {
  async listByPage(params: BrandListParams) {
    try {
      const response = await this.getPaginated<BrandListResponse>(
        API_ENDPOINTS.BRANDS,
        params
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async createBrand(data: BrandCreateRequest) {
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      data.categoryIds.forEach((categoryId) => {
        formData.append('categoryIds', categoryId.toString())
      })
      if (data.logo) {
        formData.append('image', data.logo)
      }

      const response = await this.post<void>(API_ENDPOINTS.BRANDS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getBrand(id: number) {
    try {
      const response = await this.get<BrandDetailResponse>(
        `${API_ENDPOINTS.BRANDS}/${id}`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async updateBrand(id: number, data: BrandUpdateRequest) {
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      data.categoryIds.forEach((categoryId) => {
        formData.append('categoryIds', categoryId.toString())
      })
      if (data.logo) {
        formData.append('image', data.logo)
      }

      const response = await this.put<void>(
        `${API_ENDPOINTS.BRANDS}/${id}`,
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

  async deleteBrand(id: number) {
    try {
      const response = await this.delete(`${API_ENDPOINTS.BRANDS}/${id}`)
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async listAllForExport() {
    try {
      const response = await this.get<BrandExportResponse[]>(
        `${API_ENDPOINTS.BRANDS}/all`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  exportToCSV(data: BrandExportResponse[], filename: string): void {
    ExportUtils.exportToCSV(data, filename, [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'categories', label: 'Categories' },
    ])
  }

  exportToExcel(data: BrandExportResponse[], filename: string): void {
    ExportUtils.exportToExcel(data, filename, [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'categories', label: 'Categories' },
    ])
  }

  exportToPDF(data: BrandExportResponse[], filename: string): void {
    ExportUtils.exportToPDF(data, filename, [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'categories', label: 'Categories' },
    ])
  }
}

export const brandService = new BrandService()
