export const API_BASE_URL = 'http://localhost'

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
  FEATURE_CATEGORIES: '/api/v1/feature-category-brand',
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

export const ROUTES = {
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
  ADDRESSES: '/addresses',
  ADDRESS_NEW: '/addresses/new',
  ADDRESS_EDIT: '/addresses/edit/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  EMAIL_VERIFICATION: '/verify-email',
  CUSTOMER_INFO: '/customer-info',
  PROFILE: '/profile',
  FORGOT_PASSWORD: '/forgot-password',
  NEWS: '/news',
  SUPPORT: '/supports',
  PROMOTIONS: '/promotions',
  PROMOTION_DETAIL: '/promotions/:promotionSlug',
}
