import { BaseService } from './baseService'
import { API_ENDPOINTS } from '../config/appConfig'
import {
  Customer,
  CustomerRegister,
  VerifyEmailRequest,
  ResendVerificationRequest,
  VerifyEmailResponse,
  CustomerRegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyResetCodeRequest,
} from '../types/customer'

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

  async verifyEmail(data: VerifyEmailRequest) {
    try {
      const response = await this.post<VerifyEmailResponse>(
          `${API_ENDPOINTS.CUSTOMERS}/verify-email`,
          data
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async resendVerificationCode(data: ResendVerificationRequest) {
    try {
      const response = await this.post<void>(
          `${API_ENDPOINTS.CUSTOMERS}/resend-verification`,
          data
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getCurrentCustomer() {
    try {
      const response = await this.get<Customer>(
          `${API_ENDPOINTS.CUSTOMERS}/profile`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async updateCustomerInfo(data: Partial<CustomerRegister>) {
    try {
      const response = await this.put<Customer>(
          `${API_ENDPOINTS.CUSTOMERS}/profile`,
          data
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async forgotPassword(data: ForgotPasswordRequest) {
    try {
      const response = await this.post<void>(
        `${API_ENDPOINTS.CUSTOMERS}/forgot-password`,
        data
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async verifyResetCode(data: VerifyResetCodeRequest) {
    try {
      const response = await this.post<{verified: boolean}>(
        `${API_ENDPOINTS.CUSTOMERS}/verify-reset-code`,
        data
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async resetPassword(data: ResetPasswordRequest) {
    try {
      const response = await this.post<void>(
        `${API_ENDPOINTS.CUSTOMERS}/reset-password`,
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