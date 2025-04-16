import { PaginationParams } from './commonTypes'

export interface ProductReviewResponse {
  id: number
  firstName: string
  lastName: string
  headline: string
  comment: string
  rating: number
  reviewTime: string
}

export interface ReviewListParams extends PaginationParams {
  productId: number
}
