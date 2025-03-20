import { PaginationResponse } from './commonTypes'
import { PaginationParams } from './commonTypes'

export interface ShippingRate {
  id: number
  country: string
  state: string
  rate: number
  days: number
  codSupported: boolean
}

export interface ShippingRateRequest {
  countryId: number
  state: string
  rate: number
  days: number
  codSupported: boolean
}

export interface ShippingRateListParams extends PaginationParams {
  keyword?: string
}

export interface ShippingRateCreateRequest extends ShippingRateRequest {}

export interface ShippingRateUpdateRequest extends ShippingRateRequest {}

export type ShippingRateListResponse = PaginationResponse<ShippingRate>
export type ShippingRateDetailResponse = ShippingRate
