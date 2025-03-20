import { BaseService } from './baseService'
import { API_ENDPOINTS } from '../config/appConfig'
import { Address, AddressDetail, AddressRequest } from '../types/address'
import { FormSelectResponse } from '../types/commonTypes'

class AddressService extends BaseService {
  async getAddresses(): Promise<Address[]> {
    const response = await this.get<Address[]>(API_ENDPOINTS.ADDRESSES)
    return response.result
  }

  async getAddressDetail(id: number): Promise<AddressDetail> {
    const response = await this.get<AddressDetail>(
      `${API_ENDPOINTS.ADDRESSES}/${id}`
    )
    return response.result
  }

  async createAddress(addressRequest: AddressRequest): Promise<AddressDetail> {
    const response = await this.post<AddressDetail>(
      API_ENDPOINTS.ADDRESSES,
      addressRequest
    )
    return response.result
  }

  async updateAddress(
    id: number,
    addressRequest: AddressRequest
  ): Promise<AddressDetail> {
    const response = await this.put<AddressDetail>(
      `${API_ENDPOINTS.ADDRESSES}/${id}`,
      addressRequest
    )
    return response.result
  }

  async deleteAddress(id: number): Promise<void> {
    await this.delete(`${API_ENDPOINTS.ADDRESSES}/${id}`)
  }

  async getDefaultAddress(): Promise<AddressDetail> {
    const response = await this.get<AddressDetail>(
      `${API_ENDPOINTS.ADDRESSES}/default`
    )
    return response.result
  }

  async setDefaultAddress(id: number): Promise<void> {
    await this.put(`${API_ENDPOINTS.ADDRESSES}/default/${id}`, {})
  }

  async getCountriesFormSelect(): Promise<FormSelectResponse[]> {
    const response = await this.get<FormSelectResponse[]>(
      `${API_ENDPOINTS.COUNTRIES}/form-select`
    )
    return response.result
  }
}

export default new AddressService()
