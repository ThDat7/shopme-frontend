import { BaseService } from './baseService'
import { API_ENDPOINTS } from '../config/appConfig'
import {
  CalculateShippingRequest,
  CalculateShippingResponse,
  PlaceOrderRequest,
} from '../types/checkout'

class CheckoutService extends BaseService {
  async calculateShipping(request: CalculateShippingRequest) {
    const response = await this.post<CalculateShippingResponse>(
      `${API_ENDPOINTS.CHECKOUT}/calculate-shipping`,
      request
    )
    return response.result
  }

  async placeOrder(request: PlaceOrderRequest) {
    const response = await this.post<void>(
      `${API_ENDPOINTS.CHECKOUT}/payment/COD`,
      request
    )
    return response.result
  }
}

export default new CheckoutService()
