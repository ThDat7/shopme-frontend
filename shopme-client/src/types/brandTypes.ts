export interface BrandResponse {
  id: number
  name: string
  image: string
  productCount?: number
}

export interface BrandListParams {
  page?: number
  size?: number
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  keyword?: string
}
