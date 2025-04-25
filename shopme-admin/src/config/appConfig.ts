export const API_BASE_URL = 'http://localhost:8081'

export const API_ENDPOINTS = {
  SETTINGS: '/api/v1/settings',
  PRODUCTS: '/api/v1/products',
  BRANDS: '/api/v1/brands',
  CATEGORIES: '/api/v1/categories',
  USERS: '/api/v1/users',
  AUTH: '/api/auth',
  LOCATIONS: '/api/v1/locations',
  LOCATIONS_COUNTRIES: '/api/v1/countries',
  LOCATIONS_STATES: '/api/v1/states',
  SHIPPING_RATES: '/api/v1/shipping-rates',
  ORDERS: '/api/v1/orders',
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
  LOGIN: '/login',
  PROFILE: '/profile',
  REGISTER: '/register',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/products/:id',
  ORDERS: '/orders',
  ORDER_DETAILS: '/orders/:id',
  CUSTOMERS: '/customers',
  CUSTOMER_DETAILS: '/customers/:id',
  SETTINGS: '/settings',
  NOT_FOUND: '*',

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

  LOCATIONS: '/locations',
  LOCATIONS_COUNTRIES: '/locations/countries',
  LOCATIONS_STATES: '/locations/states',

  SHIPPING_RATES: '/shipping-rates',
  SHIPPING_RATES_NEW: '/shipping-rates/new',
  SHIPPING_RATES_EDIT: '/shipping-rates/edit/:id',
}
