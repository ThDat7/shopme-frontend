import { CartItem, CartItemRequest } from '../types/cart'
import { API_ENDPOINTS } from '../config/appConfig'
import { BaseService } from './baseService'

class CartService extends BaseService {
  async getCartItems(): Promise<CartItem[]> {
    const response = await this.get<CartItem[]>(API_ENDPOINTS.CART)
    return response.result
  }

  async addToCart(request: CartItemRequest): Promise<CartItem> {
    const response = await this.post<CartItem>(API_ENDPOINTS.CART, request)
    return response.result
  }

  async updateQuantity(request: CartItemRequest): Promise<CartItem> {
    const response = await this.put<CartItem>(API_ENDPOINTS.CART, request)
    return response.result
  }

  async removeFromCart(productId: number): Promise<void> {
    await this.delete(`${API_ENDPOINTS.CART}/${productId}`)
  }

  async syncCart(items: CartItemRequest[]): Promise<CartItem[]> {
    const response = await this.post<CartItem[]>(`${API_ENDPOINTS.CART}/sync`, items)
    return response.result
  }

  getCartSummary(items: CartItem[]): {
    totalItems: number
    totalAmount: number
  } {
    return items.reduce(
      (summary, item) => ({
        totalItems: summary.totalItems + item.quantity,
        totalAmount: summary.totalAmount + item.discountPrice * item.quantity,
      }),
      { totalItems: 0, totalAmount: 0 }
    )
  }
}

export default new CartService()
