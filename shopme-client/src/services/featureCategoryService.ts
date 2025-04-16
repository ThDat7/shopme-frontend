import { BaseService } from './baseService'
import {
  FeatureCategoryBrandResponse,
  FeatureCategoryItem,
  FeatureSubcategoryItem,
} from '../types/featureCategoryTypes'
import { API_ENDPOINTS } from '../config/appConfig'

class FeatureCategoryService extends BaseService {
  async getFeatureCategories(): Promise<FeatureCategoryBrandResponse[]> {
    try {
      const response = await this.get<FeatureCategoryBrandResponse[]>(
        API_ENDPOINTS.FEATURE_CATEGORIES
      )
      return response.result
    } catch (error) {
      this.handleError(error)
      return []
    }
  }

  // Helper function để tổ chức danh mục thành cấu trúc phân cấp
  organizeFeatureCategories(
    categories: FeatureCategoryBrandResponse[]
  ): FeatureCategoryItem[] {
    // Tạo map để truy cập nhanh theo ID
    const categoryMap: Record<number, FeatureCategoryItem> = {}
    const rootCategories: FeatureCategoryItem[] = []

    // Bước 1: Tạo đối tượng cho tất cả các danh mục gốc (không có parentId)
    categories.forEach((category) => {
      if (!category.parentId) {
        const item: FeatureCategoryItem = {
          id: category.id,
          name: category.name,
          categoryId: category.categoryId,
          brandId: category.brandId || null,
          icon: category.icon,
          order: category.order,
          children: [],
        }
        categoryMap[category.id] = item
        rootCategories.push(item)
      }
    })

    // Bước 2: Thêm các danh mục con vào danh mục cha tương ứng
    categories.forEach((category) => {
      if (category.parentId && categoryMap[category.parentId]) {
        const childItem: FeatureSubcategoryItem = {
          id: category.id,
          name: category.name,
          categoryId: category.categoryId,
          brandId: category.brandId || null,
          parentId: category.parentId,
          order: category.order,
        }
        categoryMap[category.parentId].children.push(childItem)
      }
    })

    // Sắp xếp các danh mục gốc và danh mục con theo thứ tự
    rootCategories.sort((a, b) => (a.order || 0) - (b.order || 0))
    rootCategories.forEach((category) => {
      category.children.sort((a, b) => (a.order || 0) - (b.order || 0))
    })

    return rootCategories
  }
}

const featureCategoryService = new FeatureCategoryService()
export default featureCategoryService
