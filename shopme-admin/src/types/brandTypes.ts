import { PaginationParams } from './commonTypes'

export interface Brand {
  id: number
  name: string
  logo?: string
}

export interface BrandListResponse extends Brand {
  categories: string[]
}

export interface BrandDetailResponse extends Brand {
  categoryIds: Set<number>
}

export interface BrandCreateRequest {
  name: string
  logo?: File
  categoryIds: Set<number>
}

export interface BrandUpdateRequest {
  name: string
  logo?: File
  categoryIds: Set<number>
}

export interface BrandExportResponse extends Brand {
  categories: string[]
}

export interface BrandListParams extends PaginationParams {
  keyword?: string
}
