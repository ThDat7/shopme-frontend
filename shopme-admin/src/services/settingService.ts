import { API_ENDPOINTS } from '../config/appConfig'
import {
  CurrencySettings,
  OtherSetting,
  SettingCategory,
  SettingResponse,
  CurrencySelectResponse,
  GeneralSettingRequest,
} from '../types/settings'
import { BaseService } from './baseService'

class SettingService extends BaseService {
  async getSettingCategories() {
    const response = await this.get<SettingCategory[]>(
      `${API_ENDPOINTS.SETTINGS}/categories`
    )
    return response.result
  }

  async getSettingsByCategory(category: SettingCategory) {
    const response = await this.get<SettingResponse[]>(
      `${API_ENDPOINTS.SETTINGS}/categories/${category}`
    )
    return response.result
  }

  async updateGeneralSettings(settings: GeneralSettingRequest) {
    const formData = new FormData()
    formData.append('siteName', settings.siteName)
    formData.append('copyright', settings.copyright)
    if (settings.siteLogo) {
      formData.append('siteLogo', settings.siteLogo)
    }

    const response = await this.post<SettingResponse[]>(
      `${API_ENDPOINTS.SETTINGS}/categories/general`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.result
  }

  async updateCurrencySettings(settings: CurrencySettings) {
    const response = await this.post<SettingResponse[]>(
      `${API_ENDPOINTS.SETTINGS}/categories/currency`,
      settings
    )
    return response.result
  }

  async updateOtherSettings(settings: OtherSetting[]) {
    const response = await this.post<SettingResponse[]>(
      `${API_ENDPOINTS.SETTINGS}/categories/other`,
      settings
    )
    return response.result
  }

  async listCurrencies(): Promise<CurrencySelectResponse[]> {
    const response = await this.get<CurrencySelectResponse[]>(
      `${API_ENDPOINTS.SETTINGS}/currencies`
    )
    return response.result
  }
}

export default new SettingService()
