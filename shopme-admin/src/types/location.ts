import { PaginationParams } from './commonTypes'

export interface CountryListResponse {
  id: number
  name: string
  code: string
}

export interface CountryDetailResponse {
  id: number
  name: string
  code: string
}

export interface StateListResponse {
  id: number
  name: string
  country: string
}

export interface StateDetailResponse {
  id: number
  name: string
  countryId: number
}

export interface StateCreateRequest {
  name: string
  countryId: number
}

export interface StateUpdateRequest {
  name: string
  countryId: number
}

export interface CountryCreateRequest {
  name: string
  code: string
}

export interface CountryUpdateRequest {
  name: string
  code: string
}

export interface CountryListParams extends PaginationParams {
  keyword?: string
}

export interface StateListParams extends PaginationParams {
  countryId?: number
  keyword?: string
}
