import { PaginationParams } from './commonTypes'
import { PaymentMethod } from './payment'

export enum OrderStatus {
  NEW = 'NEW',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface OrderTrack {
  id: number
  status: OrderStatus
  notes: string
  updatedTime: string
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  country: string
}

export interface OrderItem {
  id: number
  productName: string
  productMainImage: string
  quantity: number
  unitPrice: number
}

export interface GetOrdersParams extends PaginationParams {
  status?: OrderStatus
}

export interface OrderListResponse {
  id: number
  status: OrderStatus
  totalPrice: number
  createdAt: Date
  paymentMethod: PaymentMethod
}

export interface OrderDetailResponse {
  id: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  createdAt: Date
  totalPrice: number
  shippingAddress: ShippingAddress
  orderItems: OrderItem[]
  orderTracks: OrderTrack[]
}

export const ORDER_STATUS_MAP: Record<
  OrderStatus,
  { label: string; color: string }
> = {
  [OrderStatus.NEW]: { label: 'New', color: 'blue' },
  [OrderStatus.PENDING_PAYMENT]: { label: 'Pending Payment', color: 'gold' },
  [OrderStatus.PAID]: { label: 'Paid', color: 'green' },
  [OrderStatus.PROCESSING]: { label: 'Processing', color: 'cyan' },
  [OrderStatus.SHIPPED]: { label: 'Shipped', color: 'geekblue' },
  [OrderStatus.DELIVERED]: { label: 'Delivered', color: 'green' },
  [OrderStatus.CANCELLED]: { label: 'Cancelled', color: 'red' },
  [OrderStatus.REFUNDED]: { label: 'Refunded', color: 'volcano' },
}
