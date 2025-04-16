import { CategoryBreadcrumbResponse } from './categoryTypes'
import { PaginationParams } from './commonTypes'

export interface ProductListResponse {
  id: number
  name: string
  alias: string
  mainImage: string

  price: number
  discountPercent: number
  discountPrice: number

  averageRating: number
  reviewCount: number
  saleCount: number

  shortDescription?: string
  description?: string
  brand?: string
  category?: string
  features?: string[]
  inStock?: boolean
  stockQuantity?: number
  createdTime?: number
  updatedTime?: string
}

export interface ProductDetailResponse {
  id: number
  name: string
  alias: string
  description: string
  inStock: boolean

  price: number
  discountPercent: number
  discountPrice: number

  length: number
  width: number
  height: number
  weight: number

  mainImage: string
  category: string
  brand: string
  images: string[]

  averageRating: number
  reviewCount: number
  saleCount: number

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
  categoryIds?: number[]
  brandIds?: number[]
  minRating?: number
  inStock?: boolean
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  filterType?: ProductFilterType
}

export enum ProductFilterType {
  ALL = 'ALL',
  BEST_SELLER = 'BEST_SELLER',
  TRENDING = 'TRENDING',
  HIGH_RATED = 'HIGH_RATED',
  DISCOUNTED = 'DISCOUNTED',
}

export const PRODUCT_TYPE_LABELS: Record<ProductFilterType, string> = {
  [ProductFilterType.ALL]: 'Tất cả sản phẩm',
  [ProductFilterType.BEST_SELLER]: 'Sản phẩm bán chạy',
  [ProductFilterType.TRENDING]: 'Đang thịnh hành',
  [ProductFilterType.HIGH_RATED]: 'Đánh giá cao',
  [ProductFilterType.DISCOUNTED]: 'Giảm giá sốc',
}
