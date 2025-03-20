export interface ListResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface PaginationParams {
  page?: number
  size?: number
  sortField?: string
  sortDirection: 'asc' | 'desc'
}

export interface PaginationResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface ApiResponse<T> {
  code: number
  message: string
  result: T
}

export interface FormSelectResponse {
  key: string
  value: string
}
