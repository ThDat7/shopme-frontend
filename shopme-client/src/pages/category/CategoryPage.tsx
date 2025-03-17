import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Breadcrumb, Card, Input, Pagination, Empty, Spin, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import {
  ProductListParams,
  ProductListResponse,
} from '../../types/productTypes'
import {
  CategoryBreadcrumbResponse,
  CategoryResponse,
} from '../../types/categoryTypes'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'

const CategoryPage: React.FC = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [breadcrumbs, setBreadcrumbs] = useState<CategoryBreadcrumbResponse[]>(
    []
  )
  const [products, setProducts] = useState<ProductListResponse[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [params, setParams] = useState<ProductListParams>({
    page: 0,
    size: 10,
    sortField: 'id',
    sortDirection: 'asc',
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (id) {
      fetchCategoryData()
    } else {
      fetchLeafCategories()
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchProducts()
    }
  }, [id, params])

  const fetchLeafCategories = async () => {
    setLoading(true)
    try {
      const result = await categoryService.getLeafCategories()
      setCategories(result)
      setBreadcrumbs([{ id: 0, name: 'Tất cả danh mục' }])
    } catch (error) {
      console.error('Error fetching leaf categories:', error)
    }
    setLoading(false)
  }

  const fetchCategoryData = async () => {
    setLoading(true)
    try {
      const result = await categoryService.getChildCategoryById(Number(id))

      setCategories(result.categories)
      setBreadcrumbs(result.breadcrumbs)
    } catch (error) {
      console.error('Error fetching category data:', error)
    }
    setLoading(false)
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const result = await productService.listByPage(params)
      setProducts(result.content)
      setTotalProducts(
        result.totalPages * (params.size || 10) || result.totalElements
      )
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
    setLoading(false)
  }

  const handleSearch = () => {
    setParams({
      ...params,
      page: 0,
      keyword: searchTerm,
    })
  }

  const handlePageChange = (page: number) => {
    setParams({
      ...params,
      page: page - 1,
    })
  }

  const calculateDiscountedPrice = (price: number, discountPercent: number) => {
    return price * (1 - discountPercent / 100)
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Breadcrumb */}
      <Breadcrumb className='mb-8'>
        <Breadcrumb.Item>
          <Link to='/'>Trang chủ</Link>
        </Breadcrumb.Item>
        {breadcrumbs.map((item, index) => (
          <Breadcrumb.Item key={item.id}>
            {index === breadcrumbs.length - 1 ? (
              item.name
            ) : (
              <Link to={`/categories/${item.id}`}>{item.name}</Link>
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>

      {/* Search */}
      <div className='mb-8'>
        <Input
          placeholder='Tìm kiếm sản phẩm...'
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-md'
          onPressEnter={handleSearch}
          suffix={
            <Button
              type='text'
              icon={<SearchOutlined />}
              onClick={handleSearch}
            />
          }
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className='flex justify-center items-center py-12'>
          <Spin size='large' />
        </div>
      )}

      {/* Categories or Products Grid */}
      {!loading && (
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8'>
          {categories.length > 0
            ? // Show Categories
              categories.map((category) => (
                <Link to={`/categories/${category.id}`} key={category.id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={category.name}
                        src={
                          category.image ||
                          'https://via.placeholder.com/300x200'
                        }
                        className='h-48 object-cover'
                      />
                    }
                  >
                    <Card.Meta title={category.name} />
                  </Card>
                </Link>
              ))
            : // Show Products
              products.map((product) => (
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

          {!loading && categories.length === 0 && products.length === 0 && (
            <div className='col-span-full'>
              <Empty description='Không tìm thấy sản phẩm nào' />
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <div className='flex justify-center'>
          <Pagination
            current={(params.page || 0) + 1}
            total={totalProducts}
            pageSize={params.size}
            onChange={handlePageChange}
            showSizeChanger={true}
            showTotal={(total) => `Total ${total} products`}
          />
        </div>
      )}
    </div>
  )
}

export default CategoryPage
