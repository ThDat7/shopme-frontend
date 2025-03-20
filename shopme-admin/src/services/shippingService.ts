import { API_ENDPOINTS } from '../config/appConfig'
import { BaseService } from './baseService'
import {
  ShippingRate,
  ShippingRateCreateRequest,
  ShippingRateDetailResponse,
  ShippingRateListParams,
  ShippingRateListResponse,
  ShippingRateUpdateRequest,
} from '../types/shipping'

class ShippingService extends BaseService {
  async getShippingRates(params: ShippingRateListParams) {
    const response = await this.get<ShippingRateListResponse>(
      API_ENDPOINTS.SHIPPING_RATES,
      params
    )
    return response.result
  }

  async getShippingRate(id: number): Promise<ShippingRateDetailResponse> {
    const response = await this.get<ShippingRateDetailResponse>(
      `${API_ENDPOINTS.SHIPPING_RATES}/${id}`
    )
    return response.result
  }

  async createShippingRate(
    data: ShippingRateCreateRequest
  ): Promise<ShippingRate> {
    const response = await this.post<ShippingRate>(
      API_ENDPOINTS.SHIPPING_RATES,
      data
    )
    return response.result
  }

  async updateShippingRate(
    id: number,
    data: ShippingRateUpdateRequest
  ): Promise<ShippingRate> {
    const response = await this.put<ShippingRate>(
      `${API_ENDPOINTS.SHIPPING_RATES}/${id}`,
      data
    )
    return response.result
  }

  async deleteShippingRate(id: number): Promise<void> {
    await this.delete(`${API_ENDPOINTS.SHIPPING_RATES}/${id}`)
  }
}

export default new ShippingService()
