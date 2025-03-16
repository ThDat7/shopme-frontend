import { API_ENDPOINTS } from '../config/appConfig'
import {
  ProductCreateRequest,
  ProductDetailResponse,
  ProductExportResponse,
  ProductForm,
  ProductListParams,
  ProductListResponse,
  ProductUpdateRequest,
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

  productFormToFormData(data: ProductForm) {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('alias', data.alias)
    formData.append('shortDescription', data.shortDescription)
    formData.append('fullDescription', data.fullDescription)
    formData.append('inStock', data.inStock.toString())
    formData.append('cost', data.cost.toString())
    formData.append('price', data.price.toString())
    formData.append('discountPercent', data.discountPercent.toString())
    formData.append('length', data.length.toString())
    formData.append('width', data.width.toString())
    formData.append('height', data.height.toString())
    formData.append('weight', data.weight.toString())
    formData.append('categoryId', data.categoryId.toString())
    formData.append('brandId', data.brandId.toString())
    formData.append('enabled', data.enabled.toString())
    data.details.forEach((detail, index) => {
      formData.append(`details[${index}].name`, detail.name)
      formData.append(`details[${index}].value`, detail.value)
    })

    return formData
  }

  async createProduct(data: ProductCreateRequest) {
    try {
      const formData = this.productFormToFormData(data)

      if (data.mainImage) formData.append('mainImage', data.mainImage)
      data.images.forEach((image) => formData.append('images', image))

      const response = await this.post<void>(API_ENDPOINTS.PRODUCTS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getProduct(id: number) {
    try {
      const response = await this.get<ProductDetailResponse>(
        `${API_ENDPOINTS.PRODUCTS}/${id}`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async updateProduct(id: number, data: ProductUpdateRequest) {
    try {
      const formData = this.productFormToFormData(data)
      data.remainingImageIds.forEach((id) =>
        formData.append('remainingImageIds', id.toString())
      )

      if (data.mainImage) formData.append('mainImage', data.mainImage)
      data.images.forEach((image) => formData.append('images', image))

      const response = await this.put<void>(
        `${API_ENDPOINTS.PRODUCTS}/${id}`,
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
