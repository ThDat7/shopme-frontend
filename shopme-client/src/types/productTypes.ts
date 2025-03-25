import { CategoryBreadcrumbResponse } from './categoryTypes'
import { PaginationParams } from './commonTypes'

export interface ProductListResponse {
  id: number
  name: string
  mainImage: string

  price: number
  discountPercent: number
  discountPrice: number

  averageRating: number
  reviewCount: number
  saleCount: number
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
  categoryId?: number
  brandId?: number
  rating?: number
  inStock?: boolean
  sortBy?: 'price' | 'name' | 'rating' | 'createdAt' | 'soldCount'
  sortDirection?: 'asc' | 'desc'
  type?: 'best-seller' | 'trending' | 'top-rated' | 'discounted'
}

export enum ProductFilterType {
  ALL = 'all',
  BEST_SELLER = 'bestSeller',
  TRENDING = 'trending',
  HIGH_RATED = 'highRated',
  DISCOUNTED = 'discounted',
}

export const PRODUCT_TYPE_LABELS: Record<ProductFilterType, string> = {
  [ProductFilterType.ALL]: 'Tất cả sản phẩm',
  [ProductFilterType.BEST_SELLER]: 'Sản phẩm bán chạy',
  [ProductFilterType.TRENDING]: 'Đang thịnh hành',
  [ProductFilterType.HIGH_RATED]: 'Đánh giá cao',
  [ProductFilterType.DISCOUNTED]: 'Giảm giá sốc',
}
