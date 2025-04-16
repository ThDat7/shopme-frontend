import { API_ENDPOINTS } from '../config/apiConfig'
import { 
    PromotionListItem,
    PromotionDetailResponse,
    Promotion,
    PromotionIdWithTypeResponse
} from '../types/promotion'
import { BaseService } from './baseService'

class PromotionService extends BaseService {
    // Lấy danh sách khuyến mãi (không bao gồm sản phẩm)
    async getPromotionsList() {
        try {
            const response = await this.get<PromotionListItem[]>(`${API_ENDPOINTS.PROMOTIONS}/list`)
            return response.result
        } catch (error) {
            this.handleError(error)
            return []
        }
    }

    // Lấy tất cả khuyến mãi đang hoạt động
    async getAllPromotions() {
        try {
            const response = await this.get<Promotion[]>(`${API_ENDPOINTS.PROMOTIONS}/active`)
            return response.result
        } catch (error) {
            this.handleError(error)
            return []
        }
    }

    // Lấy khuyến mãi hiển thị ở header
    async getHeaderPromotions() {
        try {
            const response = await this.get<Promotion[]>(`${API_ENDPOINTS.PROMOTIONS}/header`)
            return response.result
        } catch (error) {
            this.handleError(error)
            return []
        }
    }

    // Lấy chi tiết khuyến mãi theo alias (bao gồm sản phẩm)
    async getPromotionDetailByAlias(alias: string) {
        try {
            const response = await this.get<PromotionDetailResponse>(`${API_ENDPOINTS.PROMOTIONS}/alias/${alias}`)
            return response.result
        } catch (error) {
            this.handleError(error)
            return null
        }
    }

    // Lấy các loại khuyến mãi đang hoạt động
    async getCurrentPromotionTypesActive() {
        try {
            const response = await this.get<PromotionIdWithTypeResponse[]>(`${API_ENDPOINTS.PROMOTION_TYPES}`)
            return response.result
        } catch (error) {
            this.handleError(error)
            return []
        }
    }

    // Lấy chi tiết khuyến mãi theo ID
    async getPromotionDetailById(id: number) {
        try {
            const response = await this.get<PromotionDetailResponse>(`${API_ENDPOINTS.PROMOTIONS}/${id}`)
            return response.result
        } catch (error) {
            this.handleError(error)
            return null
        }
    }

    // Lấy danh sách sản phẩm từ khuyến mãi theo ID với bộ lọc
    async getPromotionProducts(id: number, params: Record<string, any> = {}) {
        try {
            // Convert params to query string
            const queryParams = new URLSearchParams();
            
            // Add all params to query string
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    if (Array.isArray(value)) {
                        // Handle arrays like categoryIds, brandIds
                        if (value.length > 0) {
                            queryParams.append(key, value.join(','));
                        }
                    } else {
                        queryParams.append(key, String(value));
                    }
                }
            });
            
            const queryString = queryParams.toString();
            const url = `${API_ENDPOINTS.PROMOTIONS}/${id}/products${queryString ? `?${queryString}` : ''}`;
            
            const response = await this.get(url);
            return response.result;
        } catch (error) {
            this.handleError(error);
            return { content: [], totalPages: 0 };
        }
    }
}

const promotionService = new PromotionService()
export default promotionService
