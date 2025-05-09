import React, { useEffect, useState } from 'react'
import { BrandListResponse, BrandListParams } from '../../types/brandTypes'
import { brandService } from '../../services/brandService'
import {
  Table,
  Button,
  Space,
  Image,
  Input,
  Modal,
  message,
  Dropdown,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useRoutes, createRoute } from '../../hooks/useRoutes'
import { ROUTES } from '../../config/appConfig'

const { Search } = Input

const BrandList: React.FC = () => {
  const { navigateTo } = useRoutes()
  const [brands, setBrands] = useState<BrandListResponse[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<BrandListParams>({
    page: 0,
    size: 10,
    sortField: 'id',
    sortDirection: 'asc',
    keyword: '',
  })

  const fetchBrands = async () => {
    try {
      setLoading(true)
      const response = await brandService.listByPage(params)
      setBrands(response.content)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error('Error fetching brands:', error)
      message.error('Failed to fetch brands')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [params])

  const handleSearch = (value: string) => {
    setParams({
      ...params,
      keyword: value,
      page: 0,
    })
  }

  const handleDelete = async (id: number) => {
    try {
      setLoading(true)
      await brandService.deleteBrand(id)
      message.success('Brand deleted successfully')
      fetchBrands()
    } catch (error) {
      console.error('Error deleting brand:', error)
      message.error('Failed to delete brand')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      const data = await brandService.listAllForExport()

      switch (format) {
        case 'csv':
          brandService.exportToCSV(data, 'brands')
          break
        case 'excel':
          brandService.exportToExcel(data, 'brands')
          break
        case 'pdf':
          brandService.exportToPDF(data, 'brands')
          break
      }
      message.success(`Brands exported to ${format.toUpperCase()} successfully`)
    } catch (error) {
      console.error('Error exporting brands:', error)
      message.error(`Failed to export brands to ${format.toUpperCase()}`)
    }
  }

  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'csv',
      label: 'Export to CSV',
      icon: <ExportOutlined />,
      onClick: () => handleExport('csv'),
    },
    {
      key: 'excel',
      label: 'Export to Excel',
      icon: <ExportOutlined />,
      onClick: () => handleExport('excel'),
    },
    {
      key: 'pdf',
      label: 'Export to PDF',
      icon: <ExportOutlined />,
      onClick: () => handleExport('pdf'),
    },
  ]

  const columns: ColumnsType<BrandListResponse> = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (logo: string) => (
        <Image
          src={logo || '/default-brand.png'}
          alt='Brand logo'
          width={50}
          height={50}
          style={{ objectFit: 'contain' }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories: string[]) => categories.join(', '),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: BrandListResponse) => (
        <Space>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => navigateTo(ROUTES.BRANDS_EDIT, { id: record.id })}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Are you sure you want to delete this brand?',
                content: 'This action cannot be undone.',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: async () => await handleDelete(record.id),
              })
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  const handleTableChange = (pagination: any, _: any, sorter: any) => {
    const direction = sorter.order === 'ascend' ? 'asc' : 'desc'
    const newParams: BrandListParams = {
      ...params,
      page: pagination.current - 1,
      sortField: sorter.field || 'id',
      sortDirection: direction,
    }
    setParams(newParams)
  }

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Space>
          <Search
            placeholder='Search brands...'
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Dropdown menu={{ items: exportMenuItems }} placement='bottomLeft'>
            <Button icon={<ExportOutlined />}>Export</Button>
          </Dropdown>
        </Space>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => navigateTo(ROUTES.BRANDS_NEW)}
        >
          Add Brand
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={brands}
        rowKey='id'
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          total: totalPages * (params.size || 10),
          pageSize: params.size || 10,
          current: (params.page || 0) + 1,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />
    </div>
  )
}

export default BrandList
