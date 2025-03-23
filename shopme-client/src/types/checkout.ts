import { PayOSCheckoutResponse } from './payment'

export interface CalculateShippingRequest {
  addressId: number
  cartItemIds: number[]
}

export interface CalculateShippingResponse {
  shippingCost: number
}

export interface PaymentMethod {
  method: string
  name: string
  description?: string
  icon?: string
}

export interface PlaceOrderCODRequest {
  addressId: number
  cartItemIds: number[]
  note?: string
}

export interface PlaceOrderPayOSRequest {
  addressId: number
  cartItemIds: number[]
  note?: string
  returnUrl: string
  cancelUrl: string
}

export interface PlaceOrderPayOSResponse {
  data: PayOSCheckoutResponse
}
