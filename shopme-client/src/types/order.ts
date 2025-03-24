import { PaginationParams } from './commonTypes'

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
