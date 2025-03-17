export const API_BASE_URL = 'http://localhost/api/v1'

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
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
}

export const ROUTES = {
  DASHBOARD: '/',

  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
}
