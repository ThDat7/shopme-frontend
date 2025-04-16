import { ProductListResponse } from '../types/productTypes';


// Mock data cho các danh mục nổi bật
export interface CategoryItem {
  id: number;
  name: string;
  image: string;
  alias: string;
  productCount: number;
}

export const mockCategories: CategoryItem[] = [
  {
    id: 1,
    name: 'Điện thoại',
    image: 'https://img.freepik.com/free-photo/smartphone-balancing-with-blue-background_23-2150271746.jpg',
    alias: 'dien-thoai',
    productCount: 158
  },
  {
    id: 2,
    name: 'Laptop',
    image: 'https://img.freepik.com/free-photo/laptop-with-blank-black-screen-pink-background_23-2148046112.jpg',
    alias: 'laptop',
    productCount: 95
  },
  {
    id: 3,
    name: 'Máy tính bảng',
    image: 'https://img.freepik.com/free-photo/tablet-with-blank-screen-pink-background_23-2148046113.jpg',
    alias: 'may-tinh-bang',
    productCount: 63
  },
  {
    id: 4,
    name: 'Đồng hồ thông minh',
    image: 'https://img.freepik.com/free-photo/modern-stationary-collection-arrangement_23-2149309642.jpg',
    alias: 'dong-ho-thong-minh',
    productCount: 47
  },
  {
    id: 5,
    name: 'Tai nghe',
    image: 'https://img.freepik.com/free-photo/top-view-earphones-case-with-copy-space_23-2149026634.jpg',
    alias: 'tai-nghe',
    productCount: 82
  },
  {
    id: 6,
    name: 'Phụ kiện',
    image: 'https://img.freepik.com/free-photo/high-angle-smartphone-accessories-arrangement_23-2149309651.jpg',
    alias: 'phu-kien',
    productCount: 215
  },
];

// Mock data cho các banner quảng cáo
export interface PromoBanner {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  color: string;
}

export const mockPromoBanners: PromoBanner[] = [
  {
    id: 1,
    title: 'Ưu đãi độc quyền online',
    description: 'Giảm thêm 5% cho thành viên mới',
    image: 'https://img.freepik.com/free-vector/special-offer-modern-sale-banner-template_1017-20667.jpg',
    link: '/register',
    color: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'
  },
  {
    id: 2,
    title: 'Trả góp 0%',
    description: 'Áp dụng cho đơn hàng từ 3 triệu',
    image: 'https://img.freepik.com/free-vector/modern-sale-banner-template-with-fluid-shapes_1361-1389.jpg',
    link: '/installment',
    color: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
  },
  {
    id: 3,
    title: 'Bảo hành mở rộng',
    description: 'Bảo vệ thiết bị của bạn lên đến 24 tháng',
    image: 'https://img.freepik.com/free-vector/modern-sale-banner-with-text-space_1361-1248.jpg',
    link: '/warranty',
    color: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
  }
];


// Mock service cho trang chủ
export const mockHomeService = {
  getCategories: () => Promise.resolve(mockCategories),
  getPromoBanners: () => Promise.resolve(mockPromoBanners),
};
