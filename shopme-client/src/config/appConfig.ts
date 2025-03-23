export const API_BASE_URL = 'http://localhost/api/v1'

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  AUTH: '/auth',
  CART: '/cart',
  ADDRESSES: '/addresses',
  COUNTRIES: '/countries',
  CHECKOUT: '/checkout',
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
  ADDRESSES: '/addresses',
  ADDRESS_NEW: '/addresses/new',
  ADDRESS_EDIT: '/addresses/edit/:id',
}
