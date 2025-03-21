export interface CalculateShippingRequest {
  addressId: number
  cartItemIds: number[]
}

export interface CalculateShippingResponse {
  shippingCost: number
}

export interface PlaceOrderRequest {
  addressId: number
  cartItemIds: number[]
  note?: string
}
