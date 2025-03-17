import { CategoryBreadcrumbResponse } from './categoryTypes'
import { PaginationParams } from './commonTypes'

export interface ProductListResponse {
  id: number
  name: string
  price: number
  discountPercent: number
  mainImage: string
}

export interface ProductDetailResponse {
  id: number
  name: string
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
  mainImage: string
  category: string
  brand: string
  images: string[]
  details: ProductSpecificResponse[]
  breadcrumbs: CategoryBreadcrumbResponse[]
}

export interface ProductSpecificResponse {
  id: number
  name: string
  value: string
}

export interface ProductListParams extends PaginationParams {
  keyword?: string
  minPrice?: number
  maxPrice?: number
}
