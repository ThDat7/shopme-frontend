// Enum cho các loại khuyến mãi (phải giống với backend)
export enum PromotionType {
  FLASH_SALE = 'FLASH_SALE',
  CATEGORY_DISCOUNT = 'CATEGORY_DISCOUNT',
  NEW_ARRIVAL = 'NEW_ARRIVAL'
}

// Thông tin cơ bản về khuyến mãi
export interface PromotionBase {
  id: number;
  title: string;
  content?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  type: PromotionType;
}

// Thông tin đầy đủ về khuyến mãi bao gồm loại và sản phẩm
export interface Promotion extends PromotionBase {
  products: PromotionProduct[];
}

// Thông tin về khuyến mãi trong danh sách
export interface PromotionListItem extends PromotionBase {
  productCount: number;
}

// Thông tin chi tiết về khuyến mãi (response từ API)
export interface PromotionDetailResponse extends PromotionBase {
}

// Thông tin về sản phẩm trong khuyến mãi
export interface PromotionProduct {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  discountPercent: number;
  discountPrice: number;
  stockLimit: number;
  soldCount: number;
}

// Response từ API cho loại khuyến mãi đang hoạt động
export interface PromotionIdWithTypeResponse {
  id: number;
  type: PromotionType;
}

// Thông tin hiển thị cho các loại khuyến mãi
export const PromotionTypeInfo: Record<PromotionType, {
  name: string;
  color: string;
  gradient: string;
  icon: string;
  slug: string;
  description: string;
}> = {
  [PromotionType.FLASH_SALE]: {
    name: 'Flash Sale',
    color: '#ff4d4d',
    gradient: 'linear-gradient(135deg, #ff4d4d 0%, #f9cb28 100%)',
    icon: 'ThunderboltOutlined',
    slug: 'flash-sale',
    description: 'Giảm sốc mỗi ngày, số lượng có hạn!'
  },
  [PromotionType.CATEGORY_DISCOUNT]: {
    name: 'Deal Sốc',
    color: '#4facfe',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: 'TagOutlined',
    slug: 'deal-soc',
    description: 'Ưu đãi cực lớn cho từng danh mục sản phẩm!'
  },
  [PromotionType.NEW_ARRIVAL]: {
    name: 'Sản Phẩm Mới',
    color: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: 'FireOutlined',
    slug: 'san-pham-moi',
    description: 'Khám phá những sản phẩm mới nhất tại ShopMe!'
  }
};

// Hàm helper để lấy thông tin hiển thị cho loại khuyến mãi
export function getPromotionTypeInfo(type: PromotionType) {
  return PromotionTypeInfo[type] || {
    name: 'Khuyến Mãi',
    color: '#1890ff',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
    icon: 'TagOutlined',
    slug: 'khuyen-mai',
    description: 'Ưu đãi đặc biệt dành cho bạn!'
  };
}

// Hàm helper để lấy loại khuyến mãi từ slug
export function getPromotionTypeBySlug(slug: string): PromotionType | undefined {
  const entry = Object.entries(PromotionTypeInfo).find(([_, info]) => info.slug === slug);
  return entry ? entry[0] as PromotionType : undefined;
}

// Hàm helper để lấy tất cả thông tin loại khuyến mãi
export function getAllPromotionTypes() {
  return Object.entries(PromotionTypeInfo).map(([type, info]) => ({
    type: type as PromotionType,
    ...info
  }));
}