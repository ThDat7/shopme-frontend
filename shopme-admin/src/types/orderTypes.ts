import { PaginationResponse } from './commonTypes'

export enum OrderStatus {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  RETURNED = 'RETURNED',
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  COD = 'COD',
}

export interface OrderListItem {
  id: number
  customerName: string
  customerId: string
  total: number
  orderTime: string
  address: string
  paymentMethod: PaymentMethod
  status: OrderStatus
}

export interface OrderDetail {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  productCost: number
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  orderTime: string
  details: OrderSpecific[]
}

export interface OrderSpecific {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  shippingCost: number
  subtotal: number
  imageUrl?: string
}

export interface OrderListParams {
  page?: number
  size?: number
  keyword?: string
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  status?: OrderStatus
  startDate?: string
  endDate?: string
}

export type OrderListResponse = PaginationResponse<OrderListItem>
