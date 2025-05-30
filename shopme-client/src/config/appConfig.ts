export const API_BASE_URL = 'http://localhost:8080'

export const API_ENDPOINTS = {
  PRODUCTS: '/api/v1/products',
  CATEGORIES: '/api/v1/categories',
  BRANDS: '/api/v1/brands',
  AUTH: '/api/v1/auth',
  CART: '/api/v1/cart',
  ADDRESSES: '/api/v1/addresses',
  COUNTRIES: '/api/v1/countries',
  CHECKOUT: '/api/v1/checkout',
  ORDERS: '/api/v1/orders',
  TEST: '/test-env',
  CUSTOMERS: '/api/v1/customers',
  PROMOTIONS: '/api/v1/promotions',
  REVIEWS: '/api/v1/reviews',
  FEATURE_CATEGORIES: '/api/v1/feature-category-brand',
  CAROUSEL_IMAGES: '/api/v1/carousel-images',
}

export const APP_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  IMAGE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  },
  TOAST: {
    DURATION: 3000,
    POSITION: 'top-right',
  },

  GOOGLE_CLIENT_ID:
    '1033932562819-mda9gtjhdtqs6fc6itm82p1ic986r682.apps.googleusercontent.com',
} as const

// Các đường dẫn frontend - việt hóa
export const VIETNAMESE_ROUTES = {
  // Trang chủ
  HOME: '/',

  // Sản phẩm
  PRODUCTS: '/san-pham', // Việt hóa từ /products
  PRODUCT_DETAIL: '/san-pham/:id', // Việt hóa từ /products/:id

  // Danh mục
  CATEGORIES: '/danh-muc', // Việt hóa từ /categories
  LEAF_CATEGORIES: '/danh-muc/danh-muc-con', // Việt hóa từ /categories/leaf-categories

  // Giỏ hàng và thanh toán
  CART: '/gio-hang', // Việt hóa từ /cart
  CHECKOUT: '/thanh-toan', // Việt hóa từ /checkout
  PAYMENT: '/thanh-toan/phuong-thuc', // Việt hóa từ /payment
  PAYMENT_RESULT: '/thanh-toan/ket-qua', // Việt hóa từ /payment/result

  // Đơn hàng
  ORDERS: '/don-hang', // Việt hóa từ /orders
  ORDER_DETAIL: '/don-hang/:id', // Việt hóa từ /orders/:id
  ORDER_TRACKING: '/tra-cuu-don-hang', // Mới thêm

  // Địa chỉ
  ADDRESSES: '/dia-chi', // Việt hóa từ /addresses
  ADDRESS_NEW: '/dia-chi/them-moi', // Việt hóa từ /addresses/new
  ADDRESS_EDIT: '/dia-chi/chinh-sua/:id', // Việt hóa từ /addresses/edit/:id

  // Xác thực
  LOGIN: '/dang-nhap', // Việt hóa từ /login
  REGISTER: '/dang-ky', // Việt hóa từ /register
  EMAIL_VERIFICATION: '/xac-thuc-email', // Việt hóa từ /verify-email
  PROFILE: '/ho-so', // Việt hóa từ /profile
  FORGOT_PASSWORD: '/quen-mat-khau', // Việt hóa từ /forgot-password
  RESET_PASSWORD: '/dat-lai-mat-khau', // Việt hóa từ /reset-password

  // Tin tức và hỗ trợ (đã việt hóa)
  NEWS: '/tin-tuc',
  SUPPORT: '/ho-tro',

  // Khuyến mãi (đã việt hóa)
  PROMOTIONS: '/khuyen-mai',
  PROMOTION_DETAIL: '/khuyen-mai/:promotionSlug',

  // Hỗ trợ
  SUPPORT_GUIDE: '/ho-tro/huong-dan-mua-hang',
  SUPPORT_RETURN_POLICY: '/ho-tro/chinh-sach-doi-tra',
  SUPPORT_WARRANTY: '/ho-tro/chinh-sach-bao-hanh',
  SUPPORT_CONTACT: '/ho-tro/lien-he',
  SUPPORT_FAQ: '/ho-tro/cau-hoi-thuong-gap',

  // Danh mục sản phẩm cụ thể
  CATEGORY_DETAIL: '/danh-muc/:categorySlug',

  // Thêm mới
  WISHLIST: '/san-pham-yeu-thich', // Mới thêm
  ABOUT: '/gioi-thieu', // Mới thêm
}

// Giữ lại phiên bản tiếng Anh để tương thích ngược với code cũ
export const ENGLISH_ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CATEGORIES: '/categories',
  LEAF_CATEGORIES: '/categories/leaf-categories',
  CART: '/cart',
  CHECKOUT: '/checkout',
  PAYMENT: '/payment',
  PAYMENT_RESULT: '/payment/result',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  ORDER_RESULT: '/order-result',
  ORDER_TRACKING: '/order-tracking',
  ADDRESSES: '/addresses',
  ADDRESS_NEW: '/addresses/new',
  ADDRESS_EDIT: '/addresses/edit/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  EMAIL_VERIFICATION: '/verify-email',
  CUSTOMER_INFO: '/customer-info',
  PROFILE: '/profile',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  PROMOTIONS: '/promotions',
  PROMOTION_DETAIL: '/promotions/:promotionSlug',

  ABOUT: '/about',
  NEWS: '/news',
  SUPPORT: '/supports',
  SUPPORT_GUIDE: '/support-guide',
  SUPPORT_RETURN_POLICY: '/support-return-policy',
  SUPPORT_WARRANTY: '/support-warranty',
  SUPPORT_CONTACT: '/support-contact',
  SUPPORT_FAQ: '/support-faq',
  WISHLIST: '/wishlist',
}

export const ROUTES = ENGLISH_ROUTES
