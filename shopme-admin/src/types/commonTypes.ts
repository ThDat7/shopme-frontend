export interface PaginationParams {
  page?: number
  size?: number
  sortField?: string
  sortDirection?: 'asc' | 'desc'
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

export interface BaseEntity {
  id: number
  createdAt?: string
  updatedAt?: string
}

export interface ImageUploadResponse {
  url: string
  filename: string
}

export interface SearchParams extends PaginationParams {
  keyword?: string
  filters?: Record<string, any>
}

export interface TableColumn<T> {
  title: string
  dataIndex: keyof T | string
  key?: string
  width?: number | string
  sorter?: boolean | ((a: T, b: T) => number)
  render?: (text: any, record: T) => React.ReactNode
  filters?: { text: string; value: any }[]
  onFilter?: (value: any, record: T) => boolean
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'number' | 'select' | 'switch' | 'date' | 'textarea' | 'image'
  rules?: any[]
  options?: { label: string; value: any }[]
  placeholder?: string
  help?: string
  disabled?: boolean
  hidden?: boolean
}

export interface FormSelectOption {
  key: string
  value: string
}
