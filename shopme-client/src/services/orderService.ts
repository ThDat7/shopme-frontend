import { BaseService } from './baseService'
import { API_ENDPOINTS } from '../config/appConfig'
import {
  OrderStatus,
  GetOrdersParams,
  OrderListResponse,
  OrderDetailResponse,
} from '../types/order'

class OrderService extends BaseService {
  async getOrders(params: GetOrdersParams) {
    try {
      const response = await this.getPaginated<OrderListResponse>(
        `${API_ENDPOINTS.ORDERS}`,
        params
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getOrderById(orderId: number) {
    try {
      const response = await this.get<OrderDetailResponse>(
        `${API_ENDPOINTS.ORDERS}/${orderId}`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getOrderStatus(orderId: number) {
    try {
      const response = await this.get<OrderStatus>(
        `${API_ENDPOINTS.ORDERS}/${orderId}/status`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async cancelOrder(orderId: number) {
    try {
      const response = await this.post<void>(
        `${API_ENDPOINTS.ORDERS}/${orderId}/cancel`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }
}

const orderService = new OrderService()
export default orderService
