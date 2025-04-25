import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Card,
  Space,
  message,
  Tag,
  Typography,
  Input,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import { ShippingRate, ShippingRateListParams } from '../../types/shipping'
import shippingService from '../../services/shippingService'
import { ROUTES } from '../../config/appConfig'

const { Title } = Typography
const { Search } = Input

const ShippingRatesPage: React.FC = () => {
  const navigate = useNavigate()
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([])
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<ShippingRateListParams>({
    page: 0,
    size: 10,
    sortField: 'country',
    sortDirection: 'asc',
  })
  const [total, setTotal] = useState(0)

  const fetchShippingRates = async () => {
    try {
      setLoading(true)
      const data = await shippingService.getShippingRates(params)
      setShippingRates(data.content)
      setTotal(data.totalPages)
    } catch (error) {
      message.error('Failed to fetch shipping rates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShippingRates()
  }, [params])

  const handleAdd = () => {
    navigate(ROUTES.SHIPPING_RATES_NEW)
  }

  const handleEdit = (record: ShippingRate) => {
    navigate(ROUTES.SHIPPING_RATES_EDIT.replace(':id', record.id.toString()))
  }

  const handleDelete = async (id: number) => {
    try {
      await shippingService.deleteShippingRate(id)
      message.success('Shipping rate deleted successfully')
      fetchShippingRates()
    } catch (error) {
      message.error('Failed to delete shipping rate')
    }
  }

  const handleSearch = (value: string) => {
    setParams((prev) => ({ ...prev, keyword: value, page: 0 }))
  }

  const handleTableChange = (pagination: any, _: any, sorter: any) => {
    const direction = sorter.order === 'ascend' ? 'asc' : 'desc'
    setParams((prev) => ({
      ...prev,
      page: pagination.current - 1,
      size: pagination.pageSize,
      sortField: sorter.field || 'country',
      sortDirection: direction,
    }))
  }

  const columns: ColumnsType<ShippingRate> = [
    {
      title: 'Country',
      dataIndex: 'country',
      sorter: true,
    },
    {
      title: 'State',
      dataIndex: 'state',
      sorter: true,
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      render: (rate: number) => `$${rate.toFixed(2)}`,
      sorter: true,
    },
    {
      title: 'Days to Deliver',
      dataIndex: 'days',
      render: (days: number) => `${days} day${days > 1 ? 's' : ''}`,
      sorter: true,
    },
    {
      title: 'COD Support',
      dataIndex: 'codSupported',
      render: (supported: boolean) => (
        <Tag color={supported ? 'success' : 'default'}>
          {supported ? 'Supported' : 'Not Supported'}
        </Tag>
      ),
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type='link' onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type='link' danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className='p-6'>
      <Card>
        <div className='flex justify-between items-center mb-4'>
          <Title level={2}>Shipping Rates</Title>
          <Space>
            <Search
              placeholder='Search shipping rates...'
              onSearch={handleSearch}
              style={{ width: 300 }}
              allowClear
            />
            <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
              Add Shipping Rate
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={shippingRates}
          rowKey='id'
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            total: total * 10,
            pageSize: params.size || 10,
            current: (params.page || 0) + 1,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />

        {/* <Modal
          title={selectedRate ? 'Edit Shipping Rate' : 'Add Shipping Rate'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          <ShippingRateForm
            initialValues={selectedRate}
            onSubmit={handleSubmit}
            onCancel={() => setModalVisible(false)}
          />
        </Modal> */}
      </Card>
    </div>
  )
}

export default ShippingRatesPage
