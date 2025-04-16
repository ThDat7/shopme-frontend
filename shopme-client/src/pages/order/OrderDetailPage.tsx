import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Card,
  Steps,
  Tag,
  Table,
  Divider,
  message,
  Timeline,
  Typography,
  Row,
  Col,
  Button,
  Space,
  Image,
  Alert,
  Breadcrumb,
  Spin,
} from 'antd'
import {
  OrderStatus,
  ORDER_STATUS_MAP,
  OrderDetailResponse,
  OrderItem,
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
  EnvironmentOutlined,
  UserOutlined,
  HomeOutlined,
  PrinterOutlined,
  DownloadOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import './order-progress.css'

const { Title, Text } = Typography

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)

  // Define full workflow paths for different order types
  const ORDER_FLOWS = {
    // Online payment normal flow
    ONLINE_PAYMENT: [
      OrderStatus.PENDING_PAYMENT,
      OrderStatus.PAID,
      OrderStatus.PROCESSING,
      OrderStatus.PACKAGED,
      OrderStatus.PICKED,
      OrderStatus.SHIPPING,
      OrderStatus.DELIVERED,
    ],

    // COD normal flow
    COD_PAYMENT: [
      OrderStatus.NEW,
      OrderStatus.PROCESSING,
      OrderStatus.PACKAGED,
      OrderStatus.PICKED,
      OrderStatus.SHIPPING,
      OrderStatus.DELIVERED,
    ],

    // Return flow (appended to any flow)
    RETURN: [
      OrderStatus.RETURN_REQUESTED,
      OrderStatus.RETURNED,
      OrderStatus.REFUNDED,
    ],
  }

  useEffect(() => {
    if (id) {
      loadOrder(parseInt(id))
    }
  }, [id])

  const loadOrder = async (orderId: number) => {
    try {
      setLoading(true)
      const orderData = await orderService.getOrderById(orderId)
      if (orderData) {
        setOrder(orderData)
      } else {
        message.error('Không thể tìm thấy thông tin đơn hàng')
        navigate(ROUTES.ORDERS)
      }
    } catch (error) {
      console.error('Không thể tải thông tin đơn hàng:', error)
      message.error('Không thể tải thông tin đơn hàng')
      navigate(ROUTES.ORDERS)
    } finally {
      setLoading(false)
    }
  }

  // Lấy icon tương ứng với trạng thái đơn hàng
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return (
          <ShoppingOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
        )
      case OrderStatus.PENDING_PAYMENT:
        return (
          <ClockCircleOutlined style={{ fontSize: '24px', color: '#faad14' }} />
        )
      case OrderStatus.PAID:
        return (
          <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
        )
      case OrderStatus.PROCESSING:
        return (
          <SyncOutlined spin style={{ fontSize: '24px', color: '#13c2c2' }} />
        )
      case OrderStatus.PACKAGED:
        return <InboxOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
      case OrderStatus.PICKED:
        return <InboxOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />
      case OrderStatus.SHIPPING:
        return <CarOutlined style={{ fontSize: '24px', color: '#2f54eb' }} />
      case OrderStatus.DELIVERED:
        return <InboxOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
      case OrderStatus.CANCELLED:
        return (
          <CloseCircleOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
        )
      case OrderStatus.CANCELLED_PAYMENT:
        return (
          <CloseCircleOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
        )
      case OrderStatus.RETURN_REQUESTED:
        return (
          <RollbackOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
        )
      case OrderStatus.RETURNED:
        return (
          <RollbackOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
        )
      case OrderStatus.REFUNDED:
        return (
          <RollbackOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
        )
      default:
        return (
          <ShoppingOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
        )
    }
  }

  // Get the complete flow (past + future) based on current order status
  const getOrderFlow = (order: OrderDetailResponse): OrderStatus[] => {
    const { status, orderTracks } = order
    let pastStatuses: OrderStatus[] = []
    let futureStatuses: OrderStatus[] = []

    // Extract past statuses from order tracks (already happened)
    pastStatuses = orderTracks
      .map((track) => track.status)
      .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates

    // Sort past statuses according to predefined flow
    const isOnlinePayment = pastStatuses.includes(OrderStatus.PENDING_PAYMENT)

    // Choose the base flow
    const baseFlow = isOnlinePayment
      ? ORDER_FLOWS.ONLINE_PAYMENT
      : ORDER_FLOWS.COD_PAYMENT

    // Find current status index in the appropriate flow
    const currentStatusIndex = baseFlow.indexOf(status)

    if (currentStatusIndex !== -1) {
      // If status is in the normal flow
      futureStatuses = baseFlow.slice(currentStatusIndex + 1)

      // Add return flow if we're at DELIVERED status
      if (status === OrderStatus.DELIVERED) {
        futureStatuses = ORDER_FLOWS.RETURN
      }
    } else if (
      status === OrderStatus.RETURN_REQUESTED ||
      status === OrderStatus.RETURNED ||
      status === OrderStatus.REFUNDED
    ) {
      // We're in the return flow
      const returnIndex = ORDER_FLOWS.RETURN.indexOf(status)
      futureStatuses = ORDER_FLOWS.RETURN.slice(returnIndex + 1)
    }

    // For cancelled or terminal states, no future steps
    if (
      status === OrderStatus.CANCELLED ||
      status === OrderStatus.CANCELLED_PAYMENT ||
      status === OrderStatus.REFUNDED
    ) {
      futureStatuses = []
    }

    // Return the complete flow: past + current + future
    return [...pastStatuses, ...futureStatuses]
  }

  // Generate Steps items for the order flow
  const getOrderStepItems = (order: OrderDetailResponse) => {
    const currentStatus = order.status
    const flow = getOrderFlow(order)

    return flow.map((status) => {
      const statusInfo = ORDER_STATUS_MAP[status]
      const isPast = order.orderTracks.some((track) => track.status === status)
      const isCurrent = status === currentStatus

      // Properly cast status to one of the expected types
      const stepStatus: 'finish' | 'process' | 'wait' | 'error' =
        isPast && !isCurrent ? 'finish' : isCurrent ? 'process' : 'wait'

      return {
        key: status,
        title: (
          <span
            className={`font-medium ${
              isPast && !isCurrent
                ? 'text-green-600'
                : isCurrent
                ? 'text-blue-600 text-lg'
                : 'text-gray-400'
            }`}
          >
            {statusInfo.label}
          </span>
        ),
        description: (
          <span
            className={`block mt-1 text-xs ${
              isPast && !isCurrent
                ? 'text-green-500'
                : isCurrent
                ? 'text-blue-500'
                : 'text-gray-400'
            }`}
          >
            {status}
          </span>
        ),
        status: stepStatus,
        icon: getStatusIcon(status),
        className:
          isPast && !isCurrent
            ? 'step-completed'
            : isCurrent
            ? 'step-current'
            : 'step-pending',
      }
    })
  }

  const renderOrderProgress = (order: OrderDetailResponse) => {
    // Sort tracks by timestamp, newest first
    const sortedTracks = [...order.orderTracks].sort(
      (a, b) =>
        new Date(b.updatedTime).getTime() - new Date(a.updatedTime).getTime()
    )

    // Get current status
    const currentStatus = order.status
    const isTerminalState =
      currentStatus === OrderStatus.CANCELLED ||
      currentStatus === OrderStatus.CANCELLED_PAYMENT ||
      currentStatus === OrderStatus.REFUNDED

    // For terminal states, only show the timeline
    if (isTerminalState) {
      return (
        <Card className='mb-6 shadow-sm'>
          <Title level={4} className='mb-4'>
            <ClockCircleOutlined className='mr-2' />
            {currentStatus === OrderStatus.REFUNDED
              ? 'Đơn hàng đã hoàn tiền'
              : 'Đơn hàng đã hủy'}
          </Title>
          <Timeline
            mode='left'
            items={sortedTracks.map((track) => ({
              color: ORDER_STATUS_MAP[track.status].color,
              label: track.updatedTime,
              children: (
                <div>
                  <Tag color={ORDER_STATUS_MAP[track.status].color}>
                    {ORDER_STATUS_MAP[track.status].label}
                  </Tag>
                  <div className='mt-2 text-gray-600 text-sm'>
                    {track.status}
                  </div>
                  {track.notes && <p className='mt-2'>{track.notes}</p>}
                </div>
              ),
              dot: getStatusIcon(track.status),
            }))}
          />
        </Card>
      )
    }

    // Generate steps items for the order flow
    const stepItems = getOrderStepItems(order)
    const currentIndex = stepItems.findIndex(
      (item) => item.status === 'process'
    )

    return (
      <Card className='mb-6 shadow-sm'>
        <Title level={4} className='mb-4'>
          <ClockCircleOutlined className='mr-2' /> Trạng thái đơn hàng
        </Title>

        <Steps
          current={currentIndex}
          direction='horizontal'
          responsive={true}
          className='order-steps'
          items={stepItems}
          progressDot={false}
        />

        <Divider className='my-4' />

        <Timeline
          mode='left'
          items={sortedTracks.map((track) => ({
            color: ORDER_STATUS_MAP[track.status].color,
            label: track.updatedTime,
            children: (
              <div>
                <Tag color={ORDER_STATUS_MAP[track.status].color}>
                  {ORDER_STATUS_MAP[track.status].label}
                </Tag>
                <div className='mt-2 text-gray-600 text-sm'>{track.status}</div>
                {track.notes && <p className='mt-2'>{track.notes}</p>}
              </div>
            ),
            dot: getStatusIcon(track.status),
          }))}
        />
      </Card>
    )
  }

  const renderOrderInfo = (order: OrderDetailResponse) => {
    return (
      <Card className='mb-6 shadow-sm'>
        <div className='flex justify-between items-center mb-4'>
          <Title level={4} className='m-0'>
            <ShoppingCartOutlined className='mr-2' /> Thông tin sản phẩm
          </Title>
          <Space>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
              In đơn hàng
            </Button>
            <Button icon={<DownloadOutlined />} type='primary'>
              Xuất PDF
            </Button>
          </Space>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='flex items-center mb-3'>
                <UserOutlined className='text-gray-500 mr-2' />
                <Text strong>Thông tin khách hàng</Text>
              </div>
              <div className='ml-6 space-y-2'>
                <div>
                  <Text strong>Họ tên:</Text>{' '}
                  {order.shippingAddress.fullName || 'Không có thông tin'}
                </div>
                <div>
                  <Text strong>SĐT:</Text>{' '}
                  {order.shippingAddress.phoneNumber || 'Không có thông tin'}
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='flex items-center mb-3'>
                <EnvironmentOutlined className='text-gray-500 mr-2' />
                <Text strong>Địa chỉ giao hàng</Text>
              </div>
              <div className='ml-6 space-y-2'>
                <div>
                  {order.shippingAddress.fullName ||
                    `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}
                </div>
                <div>
                  {order.shippingAddress.phoneNumber ||
                    order.shippingAddress.phone}
                </div>
                <div>
                  {order.shippingAddress.addressLine ||
                    order.shippingAddress.address}
                </div>
                <div>
                  {order.shippingAddress.ward || ''}
                  {order.shippingAddress.ward ? ', ' : ''}
                  {order.shippingAddress.district || ''}
                  {order.shippingAddress.district ? ', ' : ''}
                  {order.shippingAddress.province || order.shippingAddress.city}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='flex items-center mb-3'>
                <ClockCircleOutlined className='text-gray-500 mr-2' />
                <Text strong>Thời gian đặt hàng</Text>
              </div>
              <div className='ml-6'>
                {order.orderTime
                  ? new Date(order.orderTime).toLocaleString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })
                  : new Date(order.createdAt).toLocaleString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='flex items-center mb-3'>
                <ShoppingOutlined className='text-gray-500 mr-2' />
                <Text strong>Phương thức thanh toán</Text>
              </div>
              <div className='ml-6'>
                <Tag color='blue'>{order.paymentMethod}</Tag>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    )
  }

  const renderOrderItems = (order: OrderDetailResponse) => {
    const columns = [
      {
        title: 'Sản phẩm',
        key: 'product',
        render: (record: OrderItem) => (
          <div className='flex items-center'>
            <Image
              src={record.productMainImage}
              alt={record.productName}
              width={60}
              height={60}
              className='object-cover rounded mr-3'
              preview={false}
            />
            <div>
              <Text
                strong
                className='hover:text-blue-500 cursor-pointer'
                onClick={() =>
                  navigate(
                    createRoute(ROUTES.PRODUCT_DETAIL, {
                      id: record.productId || record.id,
                    })
                  )
                }
              >
                {record.productName}
              </Text>
              {record.discountPercent && record.discountPercent > 0 && (
                <Tag color='red' className='mt-1 block w-fit'>
                  -{record.discountPercent}%
                </Tag>
              )}
            </div>
          </div>
        ),
      },
      {
        title: 'Đơn giá',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        render: (unitPrice: number) => unitPrice.toLocaleString('vi-VN') + '₫',
        responsive: ['md'] as any,
      },
      {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
        responsive: ['md'] as any,
      },
      {
        title: 'Giảm giá',
        key: 'discount',
        render: (record: OrderItem) =>
          record.discountPercent && record.discountPercent > 0
            ? `${record.discountPercent}%`
            : 'Không',
        responsive: ['lg'] as any,
      },
      {
        title: 'Thành tiền',
        key: 'total',
        render: (record: OrderItem) =>
          (
            record.quantity *
            record.unitPrice *
            (1 - (record.discountPercent || 0) / 100)
          ).toLocaleString('vi-VN') + '₫',
        align: 'right' as const,
      },
    ]

    return (
      <Card className='mb-6 shadow-sm'>
        <Title level={4} className='mb-4'>
          <ShoppingOutlined className='mr-2' /> Chi tiết sản phẩm
        </Title>

        <Table
          columns={columns}
          dataSource={order.orderItems}
          rowKey='id'
          pagination={false}
          summary={(pageData) => {
            let totalPrice = 0

            pageData.forEach(({ quantity, unitPrice, discountPercent }) => {
              totalPrice +=
                quantity * unitPrice * (1 - (discountPercent || 0) / 100)
            })

            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4}>
                    <Text strong>Tổng tiền</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong>{totalPrice.toLocaleString('vi-VN')}₫</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4}>
                    <Text strong>Phí vận chuyển</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong>
                      {(order.shippingCost || 0).toLocaleString('vi-VN')}₫
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4}>
                    <Text strong className='text-lg'>
                      Tổng cộng
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong className='text-lg text-red-500'>
                      {order.totalPrice.toLocaleString('vi-VN')}₫
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )
          }}
        />
      </Card>
    )
  }

  if (loading) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <Spin tip='Đang tải...'>
          <div className='text-center py-8'>Đang tải...</div>
        </Spin>
      </div>
    )
  }

  if (!order) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <Alert
          message='Không thể tìm thấy thông tin đơn hàng'
          description='Rất tiếc, chúng tôi không thể tìm thấy thông tin đơn hàng của bạn. Hãy thử lại sau.'
          type='error'
          showIcon
        />
        <Button
          type='primary'
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(ROUTES.ORDERS)}
          className='mt-4'
        >
          Quay lại danh sách đơn hàng
        </Button>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8 px-4'>
      <Breadcrumb className='mb-6'>
        <Breadcrumb.Item>
          <Link to={ROUTES.HOME}>
            <HomeOutlined /> Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={ROUTES.ORDERS}>Đơn hàng của tôi</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết đơn hàng #{order.id}</Breadcrumb.Item>
      </Breadcrumb>

      <div className='flex justify-between items-center mb-6'>
        <Title level={2} className='m-0'>
          Chi tiết đơn hàng #{order.id}
        </Title>
        <Tag
          color={ORDER_STATUS_MAP[order.status].color}
          className='text-base px-3 py-1'
        >
          {ORDER_STATUS_MAP[order.status].label}
        </Tag>
      </div>

      {renderOrderProgress(order)}
      {renderOrderInfo(order)}
      {renderOrderItems(order)}

      <div className='flex justify-between mt-6'>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(ROUTES.ORDERS)}
        >
          Quay lại danh sách đơn hàng
        </Button>

        {order.status === OrderStatus.DELIVERED && (
          <Button type='primary'>Mua lại</Button>
        )}
      </div>
    </div>
  )
}

export default OrderDetailPage
