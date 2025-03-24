import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Steps,
  Tag,
  Table,
  Descriptions,
  Divider,
  message,
  Timeline,
} from 'antd'
import {
  OrderStatus,
  ORDER_STATUS_MAP,
  OrderDetailResponse,
  OrderItem,
} from '../../types/order'
import orderService from '../../services/orderService'
import { ROUTES } from '../../config/appConfig'

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadOrder(parseInt(id))
    }
  }, [id])

  const loadOrder = async (orderId: number) => {
    try {
      setLoading(true)
      const data = await orderService.getOrderById(orderId)
      setOrder(data)
    } catch (error) {
      message.error('Failed to load order details')
      navigate(ROUTES.ORDERS)
    } finally {
      setLoading(false)
    }
  }

  const renderOrderProgress = (order: OrderDetailResponse) => {
    const isOrderCancelled = order.status === OrderStatus.CANCELLED
    const isOrderRefunded = order.status === OrderStatus.REFUNDED

    if (isOrderCancelled || isOrderRefunded) {
      return (
        <Timeline>
          {order.orderTracks
            .sort(
              (a, b) =>
                new Date(a.updatedTime).getTime() -
                new Date(b.updatedTime).getTime()
            )
            .map((track) => (
              <Timeline.Item
                key={track.id}
                color={ORDER_STATUS_MAP[track.status].color}
              >
                <div style={{ marginBottom: '8px' }}>
                  <Tag color={ORDER_STATUS_MAP[track.status].color}>
                    {ORDER_STATUS_MAP[track.status].label}
                  </Tag>
                  <span style={{ marginLeft: '8px', color: '#666' }}>
                    {new Date(track.updatedTime).toLocaleString()}
                  </span>
                </div>
                {track.notes && <p>{track.notes}</p>}
              </Timeline.Item>
            ))}
        </Timeline>
      )
    }

    const currentStep = order.orderTracks.sort(
      (a, b) =>
        new Date(b.updatedTime).getTime() - new Date(a.updatedTime).getTime()
    )[0]

    return (
      <Steps
        current={getOrderStep(currentStep.status)}
        style={{ marginBottom: 24 }}
      >
        <Steps.Step title='New' description='Order placed' />
        <Steps.Step title='Pending Payment' description='Waiting for payment' />
        <Steps.Step title='Paid' description='Payment confirmed' />
        <Steps.Step title='Processing' description='Preparing order' />
        <Steps.Step title='Shipped' description='In transit' />
        <Steps.Step title='Delivered' description='Order completed' />
      </Steps>
    )
  }

  const getOrderStep = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return 0
      case OrderStatus.PENDING_PAYMENT:
        return 1
      case OrderStatus.PAID:
        return 2
      case OrderStatus.PROCESSING:
        return 3
      case OrderStatus.SHIPPED:
        return 4
      case OrderStatus.DELIVERED:
        return 5
      default:
        return 0
    }
  }

  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (record: OrderItem) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={record.productMainImage}
            alt={record.productName}
            style={{ width: 50, height: 50, marginRight: 10 }}
          />
          <span>{record.productName}</span>
        </div>
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (unitPrice: number) => `$${unitPrice.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (record: OrderItem) =>
        `$${(record.unitPrice * record.quantity).toFixed(2)}`,
    },
  ]

  if (loading) {
    return <Card loading={true} />
  }

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card title={`Order #${order.id}`}>
        {renderOrderProgress(order)}

        <Descriptions title='Order Information' bordered>
          <Descriptions.Item label='Order Status'>
            <Tag color={ORDER_STATUS_MAP[order.status].color}>
              {ORDER_STATUS_MAP[order.status].label}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label='Payment Method'>
            {order.paymentMethod}
          </Descriptions.Item>
          <Descriptions.Item label='Order Date'>
            {new Date(order.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label='Total Amount'>
            ${order.totalPrice.toFixed(2)}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Descriptions title='Recipient Information' bordered>
          <Descriptions.Item label='Name'>
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </Descriptions.Item>
          <Descriptions.Item label='Phone'>
            {order.shippingAddress.phone}
          </Descriptions.Item>
          <Descriptions.Item label='Address'>
            {`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <h3>Order Items</h3>
        <Table
          columns={columns}
          dataSource={order.orderItems}
          pagination={false}
          rowKey='id'
        />

        <Divider />

        <h3>Order History</h3>
        <Timeline>
          {order.orderTracks
            .sort(
              (a, b) =>
                new Date(b.updatedTime).getTime() -
                new Date(a.updatedTime).getTime()
            )
            .map((track) => (
              <Timeline.Item
                key={track.id}
                color={ORDER_STATUS_MAP[track.status].color}
              >
                <div style={{ marginBottom: '8px' }}>
                  <Tag color={ORDER_STATUS_MAP[track.status].color}>
                    {ORDER_STATUS_MAP[track.status].label}
                  </Tag>
                  <span style={{ marginLeft: '8px', color: '#666' }}>
                    {new Date(track.updatedTime).toLocaleString()}
                  </span>
                </div>
                {track.notes && <p>{track.notes}</p>}
              </Timeline.Item>
            ))}
        </Timeline>
      </Card>
    </div>
  )
}

export default OrderDetailPage
