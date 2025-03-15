import { PaginationParams } from './commonTypes'

export interface Product {
  name: string
  enabled: boolean
}

export interface ProductSpecific {
  name: string
  value: string
}

export interface ProductForm extends Product {
  alias: string
  shortDescription: string
  fullDescription: string
  inStock: boolean
  cost: number
  price: number
  discountPercent: number
  length: number
  width: number
  height: number
  weight: number
  categoryId: number
  brandId: number
  details: ProductSpecific[]
}

export interface ProductListResponse extends Product {
  id: number
  mainImage: string
  category: String
  brand: String
}

export interface ProductDetailResponse extends ProductForm {
  id: number
  mainImage: string
  images: string[]
  createdTime: Date
  updatedTime: Date
}

export interface ProductCreateRequest extends ProductForm {
  mainImage: File
  images: File[]
}

export interface ProductUpdateRequest extends ProductForm {
  mainImage: File
  images: File[]
}

export interface ProductExportResponse extends Product {
  id: number
  brand: string
  category: string
}

export interface ProductListParams extends PaginationParams {
  keyword?: string
}
