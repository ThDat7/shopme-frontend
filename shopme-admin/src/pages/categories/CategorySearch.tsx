import React, { useState, useEffect } from 'react'
import '@ant-design/v5-patch-for-react-19'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Switch,
  Popconfirm,
  message,
  Typography,
} from 'antd'
import {
  PlusOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import { categoryService } from '../../services/categoryService'
import {
  CategorySearchResponse,
  CategoryListParams,
} from '../../types/categoryTypes'

const { Search } = Input
const { Title } = Typography

const CategorySearch: React.FC = () => {
  const [categories, setCategories] = useState<CategorySearchResponse[]>([])
  const [keyword, setKeyword] = useState('')
  const [sortField, setSortField] = useState('name')
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const keywordParam = searchParams.get('keyword')

    if (keywordParam) {
      setKeyword(keywordParam)
      searchCategories(keywordParam)
    }
  }, [location.search])

  const searchCategories = async (keyword: string) => {
    setLoading(true)
    try {
      const params: CategoryListParams = {
        keyword,
        page: pagination.current - 1,
        size: pagination.pageSize,
        sortField,
        sortDirection: sortOrder === 'ascend' ? 'asc' : 'desc',
      }

      const response = await categoryService.search(params)
      setCategories(response.content)
      setPagination({
        ...pagination,
        total: response.totalElements,
      })
    } catch (error) {
      message.error('Failed to search categories')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/categories/search?keyword=${encodeURIComponent(keyword)}`)
      searchCategories(keyword)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await categoryService.deleteCategory(id)
      message.success('Category deleted successfully')
      searchCategories(keyword)
    } catch (error) {
      message.error(
        'Failed to delete category. It may have subcategories or products.'
      )
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

  const handleTableChange = (pagination: any, sorter: any) => {
    setPagination(pagination)
    if (sorter.field) {
      setSortField(sorter.field)
      setSortOrder(sorter.order)
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
      render: (image: string, record: CategorySearchResponse) =>
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
    },
    {
      title: 'Alias',
      dataIndex: 'alias',
      sorter: true,
    },
    {
      title: 'Breadcrumb',
      dataIndex: 'breadcrumb',
      render: (breadcrumb: string) => (
        <span className='text-muted small'>{breadcrumb}</span>
      ),
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      sorter: true,
      render: (enabled: boolean, record: CategorySearchResponse) => (
        <Switch
          checked={enabled}
          onChange={() => handleStatusChange(record.id, enabled)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: CategorySearchResponse) => (
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
          <Title level={4}>Search Categories</Title>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/categories')}
            >
              Back to Categories
            </Button>
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

        <Search
          placeholder='Search categories...'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={handleSearch}
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

export default CategorySearch
