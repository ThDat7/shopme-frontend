// Định nghĩa kiểu dữ liệu cho FeatureCategoryBrand từ API
export interface FeatureCategoryBrandResponse {
  id: number
  name: string
  order: number
  categoryId: number
  brandId?: number | null
  parentId?: number | null
  icon?: string
}

// Interface đã tổ chức cho UI hiển thị
export interface FeatureCategoryItem {
  id: number
  name: string
  categoryId: number
  brandId?: number | null
  icon?: string
  order?: number
  children: FeatureSubcategoryItem[]
}

export interface FeatureSubcategoryItem {
  id: number
  name: string
  categoryId: number
  brandId?: number | null
  parentId: number
  order?: number
}

// Các helper types cho việc xử lý cấu trúc phân cấp
export interface FeatureCategoryMap {
  [key: number]: FeatureCategoryItem
}
