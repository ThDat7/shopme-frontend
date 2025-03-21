import { BaseService } from './baseService'
import { API_ENDPOINTS } from '../config/appConfig'
import {
  CalculateShippingRequest,
  CalculateShippingResponse,
  PaymentMethod,
  PlaceOrderCODRequest,
  PlaceOrderPayOSRequest,
  PlaceOrderPayOSResponse,
} from '../types/checkout'

class CheckoutService extends BaseService {
  async calculateShipping(request: CalculateShippingRequest) {
    const response = await this.post<CalculateShippingResponse>(
      `${API_ENDPOINTS.CHECKOUT}/calculate-shipping`,
      request
    )
    return response.result
  }

  async getPaymentMethods() {
    const response = await this.get<PaymentMethod[]>(
      `${API_ENDPOINTS.CHECKOUT}/payment/methods`
    )
    return response.result
  }

  async placeOrderCOD(request: PlaceOrderCODRequest) {
    const response = await this.post<void>(
      `${API_ENDPOINTS.CHECKOUT}/payment/COD`,
      request
    )
    return response.result
  }

  async placeOrderPayOS(request: PlaceOrderPayOSRequest) {
    const response = await this.post<PlaceOrderPayOSResponse>(
      `${API_ENDPOINTS.CHECKOUT}/payment/PAY_OS`,
      request
    )
    return response.result
  }
}

export default new CheckoutService()
