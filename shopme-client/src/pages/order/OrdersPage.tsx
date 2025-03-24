import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Tabs, List, Tag, Button, Empty, Spin } from 'antd'
import {
  Order,
  OrderStatus,
  ORDER_STATUS_MAP,
  OrderListResponse,
} from '../../types/order'
import orderService from '../../services/orderService'
import { ROUTES } from '../../config/appConfig'

const PAGE_SIZE = 10

const OrdersPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.NEW)
  const [orders, setOrders] = useState<OrderListResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loadOrders(activeTab, currentPage)
  }, [activeTab, currentPage])

  const loadOrders = async (status: OrderStatus, page: number) => {
    try {
      setLoading(true)
      const response = await orderService.getOrders({
        status,
        page: page - 1,
        size: PAGE_SIZE,
        sortDirection: 'desc',
      })
      setOrders(response.content)
      setTotal(response.totalElements)
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key as OrderStatus)
    setCurrentPage(1)
  }

  const renderOrderItem = (order: OrderListResponse) => (
    <List.Item
      key={order.id}
      actions={[
        <Button
          key='view'
          type='link'
          onClick={() => navigate(`${ROUTES.ORDERS}/${order.id}`)}
        >
          View Details
        </Button>,
      ]}
    >
      <List.Item.Meta
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Order #{order.id}</span>
            <Tag color={ORDER_STATUS_MAP[order.status].color}>
              {ORDER_STATUS_MAP[order.status].label}
            </Tag>
          </div>
        }
        description={
          <div>
            <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Total: ${order.totalPrice.toFixed(2)}</p>
            <p>Payment Method: {order.paymentMethod}</p>
          </div>
        }
      />
    </List.Item>
  )

  const items = Object.values(OrderStatus).map((status) => ({
    key: status,
    label: ORDER_STATUS_MAP[status].label,
    children: (
      <List
        loading={loading}
        dataSource={orders}
        renderItem={renderOrderItem}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total,
          onChange: setCurrentPage,
        }}
        locale={{
          emptyText: <Empty description='No orders found' />,
        }}
      />
    ),
  }))

  return (
    <div style={{ padding: '24px' }}>
      <Card title='My Orders'>
        <Tabs
          activeKey={activeTab}
          items={items}
          onChange={handleTabChange}
          type='card'
        />
      </Card>
    </div>
  )
}

export default OrdersPage
