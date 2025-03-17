import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  Input,
  Select,
  Pagination,
  Empty,
  Spin,
  Row,
  Col,
  Space,
  Slider,
  Button,
  Tag,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import productService from '../../services/productService'
import {
  ProductListParams,
  ProductListResponse,
} from '../../types/productTypes'

const sortOptions = [
  {},
  { value: 'name,asc', label: 'Tên A-Z' },
  { value: 'name,desc', label: 'Tên Z-A' },
  { value: 'price,asc', label: 'Giá tăng dần' },
  { value: 'price,desc', label: 'Giá giảm dần' },
  { value: 'createdTime,desc', label: 'Mới nhất' },
]

const ProductListPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<ProductListResponse[]>([])
  const [totalPages, setTotalPages] = useState(0)

  const [searchParams, setSearchParams] = useState<ProductListParams>({
    page: 0,
    size: 10,
    sortField: 'id',
    sortDirection: 'asc',
    keyword: '',
    minPrice: 0,
    maxPrice: 100000000,
  })
  const [filters, setFilters] = useState<ProductListParams>({
    ...searchParams,
  })

  const priceRange = [0, 100000000]

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const result = await productService.listByPage(searchParams)
      setProducts(result.content)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [searchParams])

  const handleSearch = () => {
    setSearchParams({
      ...filters,
      page: 0,
    })
  }

  const handleSort = (value: string) => {
    const [sortField, sortDirection] = value.split(',')
    setFilters((prev) => ({
      ...prev,
      sortField,
      sortDirection: sortDirection as 'asc' | 'desc',
    }))
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setSearchParams((prev) => ({
      ...prev,
      page: page - 1,
      size: pageSize,
    }))
  }

  const handlePriceRangeChange = (values: number[]) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1],
    }))
  }

  const clearFilters = () => {
    const resetFilters = {
      page: 0,
      size: 10,
      sortField: 'id',
      sortDirection: 'asc' as 'asc' | 'desc',
      keyword: '',
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    }
    setFilters(resetFilters)
    setSearchParams(resetFilters)
  }

  const calculateDiscountedPrice = (price: number, discountPercent: number) => {
    return price * (1 - discountPercent / 100)
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Search and Filter Section */}
      <div className='mb-8'>
        <Row gutter={[16, 16]} align='middle'>
          <Col xs={24} md={8}>
            <Input
              placeholder='Tìm kiếm sản phẩm...'
              prefix={<SearchOutlined />}
              value={filters.keyword}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, keyword: e.target.value }))
              }
              onPressEnter={handleSearch}
              allowClear
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder='Sắp xếp theo'
              value={`${filters.sortField},${filters.sortDirection}`}
              onChange={handleSort}
              options={sortOptions}
            />
          </Col>
          <Col xs={24} md={8}>
            <Space>
              <span>Giá: </span>
              <Slider
                range
                style={{ width: 200 }}
                min={priceRange[0]}
                max={priceRange[1]}
                value={[
                  filters.minPrice || priceRange[0],
                  filters.maxPrice || priceRange[1],
                ]}
                onChange={handlePriceRangeChange}
                tooltip={{
                  formatter: (value) => `${value?.toLocaleString('vi-VN')}đ`,
                }}
              />
              <Button
                type='primary'
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                Tìm kiếm
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Active Filters */}
        {(searchParams.keyword ||
          (searchParams.minPrice || 0) > priceRange[0] ||
          (searchParams.maxPrice || 0) < priceRange[1]) && (
          <div className='mt-4'>
            <Space wrap>
              {searchParams.keyword && (
                <Tag
                  closable
                  onClose={() => {
                    setFilters((prev) => ({ ...prev, keyword: '' }))
                    setSearchParams((prev) => ({ ...prev, keyword: '' }))
                  }}
                >
                  Tìm kiếm: {searchParams.keyword}
                </Tag>
              )}
              {(searchParams.minPrice ||
                0 > priceRange[0] ||
                searchParams.maxPrice ||
                0 < priceRange[1]) && (
                <Tag
                  closable
                  onClose={() => {
                    handlePriceRangeChange(priceRange as [number, number])
                    setSearchParams((prev) => ({
                      ...prev,
                      minPrice: priceRange[0],
                      maxPrice: priceRange[1],
                    }))
                  }}
                >
                  Giá:{' '}
                  {searchParams.minPrice?.toLocaleString('vi-VN') ||
                    priceRange[0].toLocaleString('vi-VN')}
                  đ -{' '}
                  {searchParams.maxPrice?.toLocaleString('vi-VN') ||
                    priceRange[1].toLocaleString('vi-VN')}
                  đ
                </Tag>
              )}
              <Button type='link' onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </Space>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className='flex justify-center items-center py-12'>
          <Spin size='large' />
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8'>
            {products.map((product) => (
              <Link to={`/products/${product.id}`} key={product.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.name}
                      src={
                        product.mainImage || 'https://via.placeholder.com/300'
                      }
                      className='h-48 object-cover'
                    />
                  }
                >
                  <Card.Meta
                    title={product.name}
                    description={
                      <div>
                        {product.discountPercent > 0 ? (
                          <>
                            <div className='text-gray-400 line-through'>
                              {product.price.toLocaleString('vi-VN')}đ
                            </div>
                            <div className='text-primary font-semibold'>
                              {calculateDiscountedPrice(
                                product.price,
                                product.discountPercent
                              ).toLocaleString('vi-VN')}
                              đ
                            </div>
                            <div className='text-red-500 text-sm'>
                              -{product.discountPercent}%
                            </div>
                          </>
                        ) : (
                          <div className='text-primary font-semibold'>
                            {product.price.toLocaleString('vi-VN')}đ
                          </div>
                        )}
                      </div>
                    }
                  />
                </Card>
              </Link>
            ))}
          </div>

          {products.length === 0 && (
            <Empty description='Không tìm thấy sản phẩm nào' />
          )}

          {/* Pagination */}
          {products.length > 0 && (
            <div className='flex justify-center'>
              <Pagination
                current={(searchParams.page || 0) + 1}
                total={totalPages * (searchParams.size || 10)}
                pageSize={searchParams.size || 10}
                onChange={handlePageChange}
                showSizeChanger
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} của ${total} sản phẩm`
                }
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProductListPage
