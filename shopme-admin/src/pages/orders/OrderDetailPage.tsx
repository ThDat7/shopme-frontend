import React, { useEffect, useState } from 'react'
import {
  Card,
  Typography,
  Descriptions,
  Table,
  Button,
  Space,
  message,
  Tag,
  Image,
  Row,
  Col,
  Spin,
  Breadcrumb,
  Statistic,
} from 'antd'
import { ArrowLeftOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons'
import { useParams, Link } from 'react-router-dom'
import orderService from '../../services/orderService'
import { OrderDetail, OrderSpecific } from '../../types/orderTypes'
import { ROUTES } from '../../config/appConfig'
import dayjs from 'dayjs'
import OrderStatusBadge from '../../components/order/OrderStatusBadge'
import { useRoutes } from '../../hooks/useRoutes'

const { Title, Text } = Typography

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { navigateTo } = useRoutes()
  
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<OrderDetail | null>(null)

  useEffect(() => {
    if (id) {
      fetchOrderDetail(parseInt(id))
    }
  }, [id])

  const fetchOrderDetail = async (orderId: number) => {
    try {
      setLoading(true)
      const data = await orderService.getOrderById(orderId)
      setOrder(data)
    } catch (error) {
      message.error('Failed to fetch order details')
      navigateTo(ROUTES.ORDERS)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    
    try {
      await orderService.deleteOrder(parseInt(id))
      message.success('Order deleted successfully')
      navigateTo(ROUTES.ORDERS)
    } catch (error) {
      message.error('Failed to delete order')
    }
  }

  const handleGoBack = () => {
    navigateTo(ROUTES.ORDERS)
  }

  const columns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      render: (text: string, record: OrderSpecific) => (
        <Space>
          {record.imageUrl ? (
            <Image
              src={record.imageUrl}
              width={80}
              height={80}
              preview={false}
 