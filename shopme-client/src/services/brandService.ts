import { BrandResponse, BrandListParams } from '../types/brandTypes'
import { API_ENDPOINTS } from '../config/appConfig'
import { BaseService } from './baseService'

class BrandService extends BaseService {
  async getBrands(params: BrandListParams) {
    const response = await this.getPaginated<BrandResponse>(
      `${API_ENDPOINTS.BRANDS}`,
      params
    )
    return response.result
  }
}

export default new BrandService()
