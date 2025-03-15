import { API_ENDPOINTS } from '../config/appConfig'
import {
  ProductExportResponse,
  ProductListParams,
  ProductListResponse,
} from '../types/productTypes'
import { ExportUtils } from '../utils/exportUtils'
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

  async deleteProduct(id: number) {
    try {
      const response = await this.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`)
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async listAllForExport() {
    try {
      const response = await this.get<ProductExportResponse[]>(
        `${API_ENDPOINTS.PRODUCTS}/all`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async updateProductStatus(id: number, enabled: boolean) {
    try {
      const response = await this.put<void>(
        `${API_ENDPOINTS.PRODUCTS}/${id}/status`,
        { enabled }
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  exportColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'brand', label: 'Brand' },
  ]

  exportToCSV(data: ProductExportResponse[], filename: string): void {
    ExportUtils.exportToCSV(data, filename, this.exportColumns)
  }

  exportToExcel(data: ProductExportResponse[], filename: string): void {
    ExportUtils.exportToExcel(data, filename, this.exportColumns)
  }

  exportToPDF(data: ProductExportResponse[], filename: string): void {
    ExportUtils.exportToPDF(data, filename, this.exportColumns)
  }
}

export const productService = new ProductService()
