import React, { useState, useEffect } from 'react'
import '@ant-design/v5-patch-for-react-19'
import { Link, useNavigate } from 'react-router-dom'
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Tag,
  Switch,
  Popconfirm,
  message,
  Breadcrumb,
  Typography,
} from 'antd'
import {
  PlusOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons'
import { categoryService } from '../../services/categoryService'
import {
  CategoryListResponse,
  CategoryListParams,
} from '../../types/categoryTypes'

const { Search } = Input
const { Title } = Typography

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<CategoryListResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(
    null
  )
  const [breadcrumbs, setBreadcrumbs] = useState<
    { id: number | null; name: string }[]
  >([{ id: null, name: 'Root' }])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [sortField, setSortField] = useState('name')
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend')

  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
  }, [
    currentCategoryId,
    pagination.current,
    pagination.pageSize,
    sortField,
    sortOrder,
  ])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const params: CategoryListParams = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        sortField,
        sortDirection: sortOrder === 'ascend' ? 'asc' : 'desc',
      }

      let response
      if (currentCategoryId === null) {
        response = await categoryService.listByPage(params)
        setCategories(response.content)
        setPagination({
          ...pagination,
          total: response.totalElements,
        })
      } else {
        const childrenResponse = await categoryService.listChildren(
          currentCategoryId
        )
        setCategories(childrenResponse)
        setPagination({
          ...pagination,
          total: childrenResponse.length,
        })
      }
    } catch (error) {
      message.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: number, currentStatus: boolean) => {
    try {
      await categoryService.updateCategoryStatus(id, !currentStatus)
      message.success(
        `Category ${!currentStatus ? 'enabled' : 'disabled'} successfully`
      )
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === id ? { ...cat, enabled: !currentStatus } : cat
        )
      )
    } catch (error) {
      message.error('Failed to update category status')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await categoryService.deleteCategory(id)
      message.success('Category deleted successfully')
      fetchCategories()
    } catch (error) {
      message.error(
        'Failed to delete category. It may have subcategories or products.'
      )
    }
  }

  const handleViewChildren = (category: CategoryListResponse) => {
    setCurrentCategoryId(category.id)
    setBreadcrumbs((prev) => [
      ...prev,
      { id: category.id, name: category.name },
    ])
    setPagination({ ...pagination, current: 1 })
  }

  const handleBreadcrumbClick = (index: number) => {
    const breadcrumb = breadcrumbs[index]
    setCurrentCategoryId(breadcrumb.id)
    setBreadcrumbs(breadcrumbs.slice(0, index + 1))
    setPagination({ ...pagination, current: 1 })
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination(pagination)
    if (sorter.field) {
      setSortField(sorter.field)
      setSortOrder(sorter.order)
    }
  }

  const handleExport = async (type: 'csv' | 'excel' | 'pdf') => {
    try {
      const data = await categoryService.listAllForExport()
      switch (type) {
        case 'csv':
          categoryService.exportToCSV(data, 'categories')
          message.success('Categories exported to CSV successfully')
          break
        case 'excel':
          categoryService.exportToExcel(data, 'categories')
          message.success('Categories exported to Excel successfully')
          break
        case 'pdf':
          categoryService.exportToPDF(data, 'categories')
          message.success('Categories exported to PDF successfully')
          break
      }
    } catch (error) {
      message.error(`Failed to export categories to ${type.toUpperCase()}`)
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      width: '10%',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      width: '15%',
      render: (image: string, record: CategoryListResponse) =>
        image ? (
          <img
            src={`${image}`}
            alt={record.name}
            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
          />
        ) : (
          <div
            style={{
              width: '50px',
              height: '50px',
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            No Image
          </div>
        ),
    },
    {
      title: 'Category Name',
      dataIndex: 'name',
      sorter: true,
      render: (name: string, record: CategoryListResponse) => (
        <Space>
          {name}
          {record.hasChildren && (
            <Tag
              color='blue'
              style={{ cursor: 'pointer' }}
              onClick={() => handleViewChildren(record)}
            >
              <FolderOpenOutlined /> View Children
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Alias',
      dataIndex: 'alias',
      sorter: true,
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      sorter: true,
      render: (enabled: boolean, record: CategoryListResponse) => (
        <Switch
          checked={enabled}
          onChange={() => handleStatusChange(record.id, enabled)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: CategoryListResponse) => (
        <Space>
          <Link to={`/categories/edit/${record.id}`}>
            <Button type='primary' icon={<EditOutlined />} size='small'>
              Edit
            </Button>
          </Link>
          <Popconfirm
            title='Are you sure you want to delete this category?'
            onConfirm={() => handleDelete(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button
              type='primary'
              danger
              icon={<DeleteOutlined />}
              size='small'
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <Space direction='vertical' style={{ width: '100%' }} size='large'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title level={4}>Categories</Title>
          <Space>
            <Link to='/categories/new'>
              <Button type='primary' icon={<PlusOutlined />}>
                New Category
              </Button>
            </Link>
            <Button
              icon={<FileExcelOutlined />}
              onClick={() => handleExport('excel')}
            >
              Excel
            </Button>
            <Button
              icon={<FilePdfOutlined />}
              onClick={() => handleExport('pdf')}
            >
              PDF
            </Button>
          </Space>
        </div>

        <Breadcrumb>
          {breadcrumbs.map((crumb, index) => (
            <Breadcrumb.Item key={index}>
              {index === breadcrumbs.length - 1 ? (
                crumb.name
              ) : (
                <a onClick={() => handleBreadcrumbClick(index)}>{crumb.name}</a>
              )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>

        <Search
          placeholder='Search categories...'
          onSearch={(value) =>
            navigate(`/categories/search?keyword=${encodeURIComponent(value)}`)
          }
          style={{ maxWidth: 400 }}
        />

        <Table
          columns={columns}
          dataSource={categories}
          rowKey='id'
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Space>
    </Card>
  )
}

export default CategoryList
