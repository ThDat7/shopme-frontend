import React from 'react'
import { Badge } from 'antd'
import { OrderStatus } from '../../types/orderTypes'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return 'blue'
      case OrderStatus.PROCESSING:
        return 'processing'
      case OrderStatus.SHIPPED:
        return 'cyan'
      case OrderStatus.DELIVERED:
        return 'success'
      case OrderStatus.CANCELLED:
        return 'error'
      case OrderStatus.REFUNDED:
        return 'warning'
      case OrderStatus.RETURNED:
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: OrderStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')
  }

  return (
    <Badge
      status={getStatusColor(status) as any}
      text={getStatusText(status)}
    />
  )
}

export default OrderStatusBadge
