import { FormSelectResponse } from "../types/commonTypes";
import { BaseService } from './baseService';

class LocationService extends BaseService {
  async getAllProvinces() {
    try {
      const response = await this.get<FormSelectResponse[]>("/api/v1/locations/provinces/form-select");
      return response.result || [];
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getDistrictsByProvinceId(provinceId: number) {
    try {
      const response = await this.get<FormSelectResponse[]>(`/api/v1/locations/provinces/${provinceId}/districts/form-select`);
      return response.result || [];
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getWardsByDistrictId(districtId: number) {
    try {
      const response = await this.get<FormSelectResponse[]>(`/api/v1/locations/districts/${districtId}/wards/form-select`);
      return response.result || [];
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export default new LocationService();
