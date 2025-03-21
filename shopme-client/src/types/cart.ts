export interface CartItem {
  productId: number
  name: string
  mainImage: string
  quantity: number
  price: number
  discountPercent: number
  discountPrice: number
}

export interface CartItemRequest {
  productId: number
  quantity: number
}

export interface CartSummary {
  totalItems: number
  totalAmount: number
}
