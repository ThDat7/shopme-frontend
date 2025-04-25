import { API_ENDPOINTS } from '../config/appConfig'
import { FormSelectOption } from '../types/commonTypes'
import {
  CountryListResponse,
  CountryDetailResponse,
  StateListResponse,
  StateDetailResponse,
  CountryListParams,
  StateListParams,
  CountryCreateRequest,
  CountryUpdateRequest,
  StateCreateRequest,
  StateUpdateRequest,
} from '../types/location'
import { BaseService } from './baseService'

class LocationService extends BaseService {
  async listCountries(params: CountryListParams) {
    const response = await this.getPaginated<CountryListResponse>(
      API_ENDPOINTS.LOCATIONS_COUNTRIES,
      params
    )
    return response.result
  }

  async listStates(params: StateListParams = {}) {
    const response = await this.getPaginated<StateListResponse>(
      API_ENDPOINTS.LOCATIONS_STATES,
      params
    )
    return response.result
  }

  async getCountry(id: number) {
    const response = await this.get<CountryDetailResponse>(
      `${API_ENDPOINTS.LOCATIONS_COUNTRIES}/${id}`
    )
    return response.result
  }

  async getState(id: number) {
    const response = await this.get<StateDetailResponse>(
      `${API_ENDPOINTS.LOCATIONS_STATES}/${id}`
    )
    return response.result
  }

  async createCountry(country: CountryCreateRequest) {
    const response = await this.post<CountryDetailResponse>(
      API_ENDPOINTS.LOCATIONS_COUNTRIES,
      country
    )
    return response.result
  }

  async createState(state: StateCreateRequest) {
    const response = await this.post<StateDetailResponse>(
      API_ENDPOINTS.LOCATIONS_STATES,
      state
    )
    return response.result
  }

  async updateCountry(id: number, country: CountryUpdateRequest) {
    const response = await this.put<CountryDetailResponse>(
      `${API_ENDPOINTS.LOCATIONS_COUNTRIES}/${id}`,
      country
    )
    return response.result
  }

  async updateState(id: number, state: StateUpdateRequest) {
    const response = await this.put<StateDetailResponse>(
      `${API_ENDPOINTS.LOCATIONS_STATES}/${id}`,
      state
    )
    return response.result
  }

  async deleteCountry(id: number) {
    await this.delete(`${API_ENDPOINTS.LOCATIONS_COUNTRIES}/${id}`)
  }

  async deleteState(id: number) {
    await this.delete(`${API_ENDPOINTS.LOCATIONS_STATES}/${id}`)
  }

  async listCountriesForSelect() {
    const response = await this.get<FormSelectOption[]>(
      `${API_ENDPOINTS.LOCATIONS_COUNTRIES}/form-select`
    )
    return response.result
  }
}

export default new LocationService()
