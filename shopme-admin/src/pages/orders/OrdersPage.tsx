import React, { useEffect, useState } from 'react'
import {
  Table,
  Card,
  Space,
  Button,
  Typography,
  Input,
  Popconfirm,
  message,
  DatePicker,
  Select,
  Row,
  Col,
} from 'antd'
import { SearchOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import orderService from '../../services/orderService'
import OrderStatusBadge from '../../components/order/OrderStatusBadge'
import {
  OrderListItem,
  OrderListParams,
  OrderStatus,
} from '../../types/orderTypes'
import { ROUTES } from '../../config/appConfig'
import dayjs from 'dayjs'

const { Title } = Typography
const { RangePicker } = DatePicker

const OrdersPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [total, setTotal] = useState(0)
  const [params, setParams] = useState<OrderListParams>({
    page: 0,
    size: 10,
    sortField: 'orderTime',
    sortDirection: 'desc',
  })

  useEffect(() => {
    fetchOrders()
  }, [params])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderService.getOrders(params)
      setOrders(response.content)
      setTotal(response.totalElements)
    } catch (error) {
      message.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await orderService.deleteOrder(id)
      message.success('Order deleted successfully')
      fetchOrders()
    } catch (error) {
      message.error('Failed to delete order')
    }
  }

  const handleViewDetail = (id: number) => {
    navigate(ROUTES.ORDERS_DETAIL.replace(':id', id.toString()))
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const direction = sorter.order === 'ascend' ? 'asc' : 'desc'
    setParams((prev) => ({
      ...prev,
      page: pagination.current - 1,
      size: pagination.pageSize,
      sortField: sorter.field || 'orderTime',
      sortDirection: direction,
    }))
  }

  const handleSearch = (value: string) => {
    setParams((prev) => ({ ...prev, keyword: value, page: 0 }))
  }

  const handleStatusChange = (value: OrderStatus | '') => {
    setParams((prev) => ({
      ...prev,
      status: value || undefined,
      page: 0,
    }))
  }

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) {
      setParams((prev) => ({
        ...prev,
        startDate: dateStrings[0],
        endDate: dateStrings[1],
        page: 0,
      }))
    } else {
      setParams((prev) => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
        page: 0,
      }))
    }
  }

  const columns: ColumnsType<OrderListItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 70,
      sorter: true,
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      sorter: true,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      render: (total) => `$${total.toFixed(2)}`,
      sorter: true,
    },
    {
      title: 'Order Date',
      dataIndex: 'orderTime',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
      sorter: true,
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      sorter: true,
      render: (method) => {
        return method
          .replace('_', ' ')
          .replace(/\b\w/g, (l: string) => l.toUpperCase())
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: true,
      render: (status) => <OrderStatusBadge status={status} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type='primary'
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
          >
            View
          </Button>
          <Popconfirm
            title='Are you sure you want to delete this order?'
            onConfirm={() => handleDelete(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className='p-6'>
      <Card>
        <Title level={2}>Orders</Title>
        <Row gutter={16} className='mb-4'>
          <Col span={8}>
            <Input
              placeholder='Search by ID, Customer name'
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder='Filter by Status'
              style={{ width: '100%' }}
              allowClear
              onChange={handleStatusChange}
            >
              {Object.values(OrderStatus).map((status) => (
                <Select.Option key={status} value={status}>
                  {status.charAt(0) +
                    status.slice(1).toLowerCase().replace('_', ' ')}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={handleDateRangeChange}
              allowClear
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey='id'
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: (params.page || 0) + 1,
            pageSize: params.size || 10,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} orders`,
          }}
        />
      </Card>
    </div>
  )
}

export default OrdersPage
