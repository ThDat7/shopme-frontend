import { BaseService } from './baseService'
import { API_ENDPOINTS } from '../config/appConfig'
import {
  OrderDetail,
  OrderListItem,
  OrderListParams,
} from '../types/orderTypes'

class OrderService extends BaseService {
  async getOrders(params: OrderListParams) {
    const response = await this.getPaginated<OrderListItem>(
      API_ENDPOINTS.ORDERS,
      params
    )
    return response.result
  }

  async getOrderById(id: number) {
    const response = await this.get<OrderDetail>(
      `${API_ENDPOINTS.ORDERS}/${id}`
    )
    return response.result
  }
}

export default new OrderService()
