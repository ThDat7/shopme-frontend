import { BaseService } from './baseService'
import { CarouselImageResponse } from '../types/carouselTypes'
import { API_ENDPOINTS } from '../config/appConfig'

class CarouselService extends BaseService {
  /**
   * Gets carousel images to display on the home page
   * @returns Promise with carousel images
   */
  async getCarouselImages(): Promise<CarouselImageResponse[]> {
    try {
      const response = await this.get<CarouselImageResponse[]>(API_ENDPOINTS.CAROUSEL_IMAGES)
      return response.result
    } catch (error) {
      this.handleError(error)
      return []
    }
  }
}

const carouselService = new CarouselService()
export default carouselService
