import { PaginationParams } from './commonTypes'

export interface Category {
  id: number
  name: string
  alias: string
  enabled: boolean
  image?: string
}

export interface CategoryListResponse extends Category {
  hasChildren: boolean
}

export interface CategoryDetailResponse extends Category {
  parentID: number | null
}

export interface CategorySelectResponse {
  id: number
  name: string
  alias: string
  children?: CategorySelectResponse[]
}

export interface CategorySearchResponse extends Category {
  breadcrumb: string
}

export interface CategoryExportResponse extends Category {
  parentName?: string
}

export interface CategoryCreateRequest {
  name: string
  alias?: string
  enabled: boolean
  parentID?: number
  image?: File
}

export interface CategoryUpdateRequest {
  name: string
  alias?: string
  enabled: boolean
  parentID?: number
  image?: File
}

export interface CategoryFormData {
  name: string
  alias?: string
  enabled: boolean
  parentID?: number[]
  image?: any[]
}

export interface CategoryListParams extends PaginationParams {
  keyword?: string
}
