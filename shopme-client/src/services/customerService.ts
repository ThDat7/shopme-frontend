import { BaseService } from './baseService'
import { API_ENDPOINTS } from '../config/appConfig'
import { CustomerRegister, CustomerRegisterResponse } from '../types/customer'

class CustomerService extends BaseService {
  async register(data: CustomerRegister) {
    try {
      const response = await this.post<CustomerRegisterResponse>(
        `${API_ENDPOINTS.CUSTOMERS}/register`,
        data
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }
}

const customerService = new CustomerService()
export default customerService
