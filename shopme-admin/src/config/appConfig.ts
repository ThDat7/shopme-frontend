export const API_BASE_URL = 'http://localhost:8080/api/v1'

export const API_ENDPOINTS = {
  SETTINGS: '/settings',
  PRODUCTS: '/products',
  BRANDS: '/brands',
  CATEGORIES: '/categories',
  USERS: '/users',
  AUTH: '/auth',
  LOCATIONS: '/locations',
  LOCATIONS_COUNTRIES: '/countries',
  LOCATIONS_STATES: '/states',
  SHIPPING_RATES: '/shipping-rates',
  ORDERS: '/orders',
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
  HOME: '/',

  PRODUCTS: '/products',
  PRODUCTS_NEW: '/products/new',
  PRODUCTS_EDIT: '/products/edit/:id',

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

  SETTINGS: '/settings',

  LOCATIONS: '/locations',
  LOCATIONS_COUNTRIES: '/locations/countries',
  LOCATIONS_STATES: '/locations/states',

  SHIPPING_RATES: '/shipping-rates',
  SHIPPING_RATES_NEW: '/shipping-rates/new',
  SHIPPING_RATES_EDIT: '/shipping-rates/edit/:id',

  ORDERS: '/orders',
  ORDERS_DETAIL: '/orders/:id',
}
