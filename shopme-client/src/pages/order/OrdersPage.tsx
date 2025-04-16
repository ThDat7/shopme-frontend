import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, List, Tag, Button, Empty, Badge, Row, Col, Typography, Avatar, Space, Tooltip, Segmented, Pagination } from 'antd'
import {
  OrderStatus,
  ORDER_STATUS_MAP,
  OrderListResponse,
  GetOrdersParams
} from '../../types/order'
import { ROUTES } from '../../config/appConfig'
import { createRoute } from '../../hooks/useRoutes'
import orderService from '../../services/orderService'
import {
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CarOutlined,
  InboxOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
  EyeOutlined,
  DollarOutlined,
  CreditCardOutlined,
  CalendarOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography
const PAGE_SIZE = 10

const OrdersPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<OrderStatus | 'ALL'>('ALL')
  const [orders, setOrders] = useState<OrderListResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loadOrders(activeTab, currentPage)
  }, [activeTab, currentPage])

  const loadOrders = async (status: OrderStatus | 'ALL', page: number) => {
    try {
      setLoading(true)
      const params: GetOrdersParams = {
        page: page - 1,
        size: PAGE_SIZE,
      }
      
      if (status !== 'ALL') {
        params.status = status
      }
      
      const result = await orderService.getOrders(params)
      setOrders(result.content || [])
      setTotal(result.totalElements || 0)
    } catch (error) {
      console.error('Không thể tải đơn hàng:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key as OrderStatus | 'ALL')
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Lấy icon tương ứng với trạng thái đơn hàng
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return <ShoppingOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
      case OrderStatus.PENDING_PAYMENT:
        return <ClockCircleOutlined style={{ fontSize: '24px', color: '#faad14' }} />
      case OrderStatus.PAID:
        return <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
      case OrderStatus.PROCESSING:
        return <SyncOutlined spin style={{ fontSize: '24px', color: '#13c2c2' }} />
      case OrderStatus.PACKAGED:
        return <InboxOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
      case OrderStatus.PICKED:
        return <InboxOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />
      case OrderStatus.SHIPPING:
        return <CarOutlined style={{ fontSize: '24px', color: '#2f54eb' }} />
      case OrderStatus.DELIVERED:
        return <InboxOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
      case OrderStatus.CANCELLED:
        return <CloseCircleOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
      case OrderStatus.CANCELLED_PAYMENT:
        return <CloseCircleOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
      case OrderStatus.RETURN_REQUESTED:
        return <RollbackOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
      case OrderStatus.RETURNED:
        return <RollbackOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
      case OrderStatus.REFUNDED:
        return <RollbackOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
      default:
        return <ShoppingOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
    }
  }

  const renderOrderItem = (order: OrderListResponse) => {
    // Add safety check to prevent errors when status is not in the map
    const statusInfo = ORDER_STATUS_MAP[order.status] || { label: 'Không xác định', color: 'default' };
    const statusColor = statusInfo.color;
    const statusLabel = statusInfo.label;
    
    return (
      <List.Item
        key={order.id}
        className="hover:bg-gray-50 transition-colors rounded-lg p-4 border border-gray-200 mb-4"
      >
        <Row gutter={[16, 16]} align="middle" style={{ width: '100%' }}>
          <Col xs={24} md={4} className="flex justify-center">
            <Badge count={getStatusIcon(order.status)} offset={[0, 0]}>
              <Avatar 
                shape="square" 
                size={64} 
                icon={<ShoppingOutlined />} 
                style={{ backgroundColor: '#f0f0f0' }} 
              />
            </Badge>
          </Col>
          
          <Col xs={24} md={12}>
            <div>
              <Title level={5} className="mb-2 flex items-center">
                <span>Đơn hàng #{order.id}</span>
                <Tag color={statusColor} className="ml-2">
                  {statusLabel}
                </Tag>
              </Title>
              
              <Space direction="vertical" size={1} className="text-gray-500 text-sm">
                <div>
                  <CalendarOutlined className="mr-2" />
                  <span>Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div>
                  <DollarOutlined className="mr-2" />
                  <span>Tổng tiền: <Text strong>{order.totalPrice.toLocaleString('vi-VN')}₫</Text></span>
                </div>
                <div>
                  <CreditCardOutlined className="mr-2" />
                  <span>Thanh toán: {order.paymentMethod}</span>
                </div>
              </Space>
            </div>
          </Col>
          
          <Col xs={24} md={8} className="flex justify-end items-center">
            <Space>
              <Tooltip title="Xem chi tiết đơn hàng">
                <Button 
                  type="primary" 
                  icon={<EyeOutlined />} 
                  onClick={() => navigate(createRoute(ROUTES.ORDER_DETAIL, { id: order.id.toString() }))}
                >
                  Xem chi tiết
                </Button>
              </Tooltip>
              
              {order.status === OrderStatus.DELIVERED && (
                <Tooltip title="Mua lại">
                  <Button type="default" icon={<ShoppingOutlined />}>
                    Mua lại
                  </Button>
                </Tooltip>
              )}
              
              {order.status === OrderStatus.NEW && (
                <Tooltip title="Hủy đơn hàng">
                  <Button 
                    danger 
                    icon={<CloseCircleOutlined />}
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Hủy đơn
                  </Button>
                </Tooltip>
              )}
            </Space>
          </Col>
        </Row>
      </List.Item>
    )
  }

  const handleCancelOrder = async (orderId: number) => {
    try {
      setLoading(true)
      await orderService.cancelOrder(orderId)
      // Reload orders after cancellation
      loadOrders(activeTab, currentPage)
    } catch (error) {
      console.error('Không thể hủy đơn hàng:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card 
        title={<Title level={2} className="m-0">Đơn hàng của tôi</Title>}
        className="shadow-md rounded-lg"
        bordered={false}
      >
        <div className="mb-6">
          <Segmented
            options={[
              {
                label: 'Tất cả đơn hàng',
                value: 'ALL',
              },
              ...Object.values(OrderStatus).map(status => ({
                label: ORDER_STATUS_MAP[status].label,
                value: status,
              })),
            ]}
            value={activeTab}
            onChange={(value) => handleTabChange(value as string)}
            block
            size="large"
          />
        </div>

        <List
          dataSource={orders}
          renderItem={renderOrderItem}
          loading={loading}
          locale={{
            emptyText: <Empty description="Không có đơn hàng nào" />
          }}
        />

        {total > 0 && (
          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={PAGE_SIZE}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </Card>
    </div>
  )
}

export default OrdersPage
