import { PaginationParams } from './commonTypes'
import { PaymentMethod } from './payment'

export enum OrderStatus {
  // Online Payment Status
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  CANCELLED_PAYMENT = 'CANCELLED_PAYMENT',

  // COD Payment Status
  NEW = 'NEW',
  CANCELLED = 'CANCELLED',

  // Order Processing Status
  PROCESSING = 'PROCESSING',
  PACKAGED = 'PACKAGED',
  PICKED = 'PICKED',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  RETURN_REQUESTED = 'RETURN_REQUESTED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED'
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

  // mới
  fullName: string
  phoneNumber: string
  addressLine: string
  ward: string
  district: string
  province: string
}

export interface OrderItem {
  id: number
  productName: string
  productMainImage: string
  quantity: number
  unitPrice: number
  productId?: number
  discountPercent?: number
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
  shippingCost?: number
  orderTime?: string
}

export const ORDER_STATUS_MAP: Record<
  OrderStatus,
  { label: string; color: string }
> = {
  // Online Payment Status
  [OrderStatus.PENDING_PAYMENT]: { label: 'Chờ thanh toán', color: 'gold' },
  [OrderStatus.PAID]: { label: 'Đã thanh toán', color: 'green' },
  [OrderStatus.CANCELLED_PAYMENT]: { label: 'Thanh toán đã hủy', color: 'red' },

  // COD Payment Status
  [OrderStatus.NEW]: { label: 'Mới', color: 'blue' },
  [OrderStatus.CANCELLED]: { label: 'Đã hủy', color: 'red' },

  // Order Processing Status
  [OrderStatus.PROCESSING]: { label: 'Đang xử lý', color: 'cyan' },
  [OrderStatus.PACKAGED]: { label: 'Đã đóng gói', color: 'purple' },
  [OrderStatus.PICKED]: { label: 'Đã lấy hàng', color: 'magenta' },
  [OrderStatus.SHIPPING]: { label: 'Đang giao hàng', color: 'geekblue' },
  [OrderStatus.DELIVERED]: { label: 'Đã giao hàng', color: 'green' },
  [OrderStatus.RETURN_REQUESTED]: { label: 'Yêu cầu trả hàng', color: 'orange' },
  [OrderStatus.RETURNED]: { label: 'Đã trả hàng', color: 'volcano' },
  [OrderStatus.REFUNDED]: { label: 'Đã hoàn tiền', color: 'volcano' }
}
