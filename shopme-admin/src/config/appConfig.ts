export const API_BASE_URL = 'http://localhost:8080/api/v1'

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  BRANDS: '/brands',
  CATEGORIES: '/categories',
  USERS: '/users',
  AUTH: '/auth',
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

  BRANDS: '/brands',
  BRANDS_NEW: '/brands/new',
  BRANDS_EDIT: '/brands/edit/:id',

  CATEGORIES: '/categories',
  CATEGORIES_NEW: '/categories/new',
  CATEGORIES_EDIT: '/categories/edit/:id',
  CATEGORIES_SEARCH: '/categories/search',

  USERS: '/users',
  USERS_NEW: '/users/new',
  USERS_EDIT: '/users/edit/:id',
}
