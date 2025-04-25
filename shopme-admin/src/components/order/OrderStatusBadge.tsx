import React from 'react'
import { Badge, Tag } from 'antd'
import { OrderStatus, ORDER_STATUS_COLORS } from '../../types/orderTypes'

interface OrderStatusBadgeProps {
  status: OrderStatus
  showText?: boolean
  size?: 'default' | 'small'
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  showText = true,
  size = 'default',
}) => {
  const color = ORDER_STATUS_COLORS[status] || 'default'

  const getStatusText = (status: OrderStatus): string => {
    return status.replace('_', ' ')
  }

  if (showText) {
    return (
      <Tag
        color={color}
        style={{ fontSize: size === 'small' ? '12px' : '14px' }}
      >
        {getStatusText(status)}
      </Tag>
    )
  }

  // Convert colors to status type for Badge
  const getBadgeStatus = (color: string) => {
    switch (color) {
      case 'green':
        return 'success'
      case 'red':
        return 'error'
      case 'blue':
        return 'processing'
      case 'gold':
      case 'orange':
      case 'volcano':
        return 'warning'
      default:
        return 'default'
    }
  }

  return <Badge status={getBadgeStatus(color)} text='' />
}

export default OrderStatusBadge
