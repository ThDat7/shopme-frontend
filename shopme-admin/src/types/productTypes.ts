import { PaginationParams } from './commonTypes'

export interface Product {
  name: string
  enabled: boolean
}

export interface ProductListResponse extends Product {
  id: number
  mainImage: string
  category: String
  brand: String
}

export interface ProductExportResponse extends Product {
  id: number
  brand: string
  category: string
}

export interface ProductListParams extends PaginationParams {
  keyword?: string
}
