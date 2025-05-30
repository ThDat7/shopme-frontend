import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Breadcrumb,
  Tabs,
  Tag,
  Spin,
  Image,
  Row,
  Col,
  Button,
  Rate,
  InputNumber,
  Typography,
  Space,
  Divider,
  Table,
  Carousel,
  message,
} from 'antd'
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { ProductDetailResponse } from '../../types/productTypes'
import ProductReviews from '../../components/product/ProductReviews'
import { ROUTES } from '../../config/appConfig'
import { useRoutes } from '../../hooks/useRoutes'
import productService from '../../services/productService'
import { useCart } from '../../contexts/CartContext'

const { Text, Title } = Typography

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { createRoute } = useRoutes()
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<ProductDetailResponse | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const carouselRef = useRef<any>(null)

  useEffect(() => {
    fetchProductDetail()
  }, [id])

  const fetchProductDetail = async () => {
    setLoading(true)
    try {
      const productId = id ? parseInt(id, 10) : 0
      const result = await productService.getProductById(productId)
      setProduct(result)
      setSelectedImage(result.mainImage)
    } catch (error) {
      console.error('Lỗi khi lấy thông tin sản phẩm:', error)
    }
    setLoading(false)
  }

  const handleQuantityChange = (value: number | null) => {
    if (value !== null && value > 0) {
      setQuantity(value)
    }
  }

  const handleAddToCart = async () => {
    if (product) {
      try {
        setAddingToCart(true)
        await addToCart({
          productId: product.id,
          quantity: quantity,
        })
      } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error)
        message.error('Không thể thêm sản phẩm vào giỏ hàng')
      } finally {
        setAddingToCart(false)
      }
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spin size='large' />
      </div>
    )
  }

  if (!product) {
    return (
      <div className='container-fluid px-4 py-8 max-w-[1920px] mx-auto'>
        <div className='text-center'>
          <Title level={2} className='text-gray-800'>
            Không tìm thấy sản phẩm
          </Title>
          <Link
            to={ROUTES.HOME}
            className='text-primary-500 hover:text-primary-600 transition-colors duration-200'
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    {
      title: (
        <Link
          to={ROUTES.HOME}
          className='text-gray-600 hover:text-primary-500 transition-colors duration-200'
        >
          Trang chủ
        </Link>
      ),
    },
    ...product.breadcrumbs.map((category) => {
      return {
        title: (
          <Link
            to={createRoute(ROUTES.PRODUCTS, {
              categoryIds: category.id.toString(),
            })}
            className='text-gray-600 hover:text-primary-500 transition-colors duration-200'
          >
            {category.name}
          </Link>
        ),
      }
    }),
    {
      title: <span className='text-primary-500'>{product.name}</span>,
    },
  ]

  return (
    <div className='container-fluid px-4 py-8 max-w-[1920px] mx-auto'>
      {/* Breadcrumb */}
      <Breadcrumb className='mb-6' items={breadcrumbItems} />

      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8'>
        <Row gutter={[32, 32]}>
          {/* Product Images */}
          <Col xs={24} md={12} lg={10}>
            <div className='mb-4 overflow-hidden rounded-lg border border-gray-100 relative'>
              <Image
                src={selectedImage || product.mainImage}
                alt={product.name}
                className='w-full object-contain transition-transform duration-300 hover:scale-105'
                style={{ height: '500px', width: '100%' }}
                preview={{
                  mask: (
                    <div className='flex justify-center items-center gap-2'>
                      <span className='text-lg'>Xem ảnh</span>
                    </div>
                  ),
                }}
              />
            </div>

            {/* Thumbnail Carousel */}
            <div className='relative product-thumbnails-carousel'>
              <div
                className='carousel-arrow prev'
                onClick={() => carouselRef.current?.prev()}
              >
                <LeftOutlined />
              </div>
              <div
                className='carousel-arrow next'
                onClick={() => carouselRef.current?.next()}
              >
                <RightOutlined />
              </div>
              <Carousel
                slidesToShow={5}
                slidesToScroll={1}
                infinite={false}
                arrows={false}
                dots={false}
                ref={carouselRef}
              >
                <div className='carousel-item p-1'>
                  <div
                    className={`cursor-pointer border-2 rounded-md overflow-hidden transition-all duration-200 ${
                      selectedImage === product.mainImage
                        ? 'border-primary-500 shadow-md'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => setSelectedImage(product.mainImage)}
                  >
                    <img
                      src={product.mainImage}
                      alt='Ảnh chính'
                      className='w-full h-20 object-cover'
                    />
                  </div>
                </div>

                {product.images.slice(1).map((image, index) => (
                  <div key={index} className='carousel-item p-1'>
                    <div
                      className={`cursor-pointer border-2 rounded-md overflow-hidden transition-all duration-200 ${
                        selectedImage === image
                          ? 'border-primary-500 shadow-md'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt={`Ảnh ${index + 1}`}
                        className='w-full h-20 object-cover'
                      />
                    </div>
                  </div>
                ))}
              </Carousel>

              {/* CSS được đặt vào className thay vì style jsx */}
            </div>
          </Col>

          {/* Product Info */}
          <Col xs={24} md={12} lg={14}>
            <Title level={2} className='text-gray-800 mb-2'>
              {product.name}
            </Title>

            <div className='flex items-center mb-4'>
              <Rate
                disabled
                value={product.averageRating}
                className='text-amber-400 text-sm'
              />
              <Text className='ml-2 text-gray-500'>
                ({product.reviewCount} đánh giá)
              </Text>
              <Divider type='vertical' className='mx-4' />
              <Text className='text-gray-500'>Đã bán: {product.saleCount}</Text>
            </div>

            <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
              <div className='flex items-center mb-2'>
                <Text className='text-gray-600 mr-2'>Thương hiệu:</Text>
                <Link
                  to={`${ROUTES.PRODUCTS}?brand=${encodeURIComponent(
                    product.brand.toLowerCase()
                  )}`}
                  className='text-primary-500 hover:text-primary-600 transition-colors duration-200'
                >
                  {product.brand}
                </Link>
              </div>
              <div className='flex items-center'>
                <Text className='text-gray-600 mr-2'>Danh mục:</Text>
                <Link
                  to=''
                  className='text-primary-500 hover:text-primary-600 transition-colors duration-200'
                >
                  {product.category}
                </Link>
              </div>
            </div>

            <div className='mb-6'>
              {product.discountPercent > 0 ? (
                <div className='flex items-center flex-wrap'>
                  <Text
                    delete
                    type='secondary'
                    className='text-xl text-gray-400 mr-3'
                  >
                    {product.price.toLocaleString('vi-VN')}đ
                  </Text>
                  <Title level={3} className='!m-0 text-red-500'>
                    {(
                      product.price *
                      (1 - product.discountPercent / 100)
                    ).toLocaleString('vi-VN')}
                    đ
                  </Title>
                  <Tag color='red' className='ml-3 rounded-md px-2 py-1'>
                    Giảm {product.discountPercent}%
                  </Tag>
                </div>
              ) : (
                <Title level={3} className='!m-0 text-primary-500'>
                  {product.price.toLocaleString('vi-VN')}đ
                </Title>
              )}
            </div>

            <div className='mb-6'>
              <div className='flex items-center'>
                <Text className='text-gray-700 mr-4'>Tình trạng:</Text>
                {product.inStock ? (
                  <Tag
                    icon={<CheckCircleOutlined />}
                    color='success'
                    className='rounded-md px-3 py-1'
                  >
                    Còn hàng
                  </Tag>
                ) : (
                  <Tag
                    icon={<CloseCircleOutlined />}
                    color='error'
                    className='rounded-md px-3 py-1'
                  >
                    Hết hàng
                  </Tag>
                )}
              </div>
            </div>

            {/* <div className='mb-6'>
              <Paragraph className='text-gray-700 text-base'>{product.shortDescription}</Paragraph>
            </div> */}

            <div className='mb-6'>
              <div className='flex items-center mb-4'>
                <Text className='text-gray-700 mr-4'>Số lượng:</Text>
                <InputNumber
                  min={1}
                  max={product.inStock ? 10 : 0}
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={!product.inStock}
                  className='border-gray-300 hover:border-primary-500 focus:border-primary-500'
                />
              </div>

              <Space size='middle'>
                <Button
                  type='primary'
                  icon={<ShoppingCartOutlined />}
                  size='large'
                  onClick={handleAddToCart}
                  loading={addingToCart}
                  disabled={!product.inStock || addingToCart}
                  className='bg-primary-500 hover:bg-primary-600 border-primary-500 rounded-md'
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  icon={<HeartOutlined />}
                  size='large'
                  className='border-gray-300 hover:text-primary-500 hover:border-primary-500 transition-colors duration-200 rounded-md'
                >
                  Yêu thích
                </Button>
                <Button
                  icon={<ShareAltOutlined />}
                  size='large'
                  className='border-gray-300 hover:text-primary-500 hover:border-primary-500 transition-colors duration-200 rounded-md'
                >
                  Chia sẻ
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </div>

      {/* Tabs thông tin chi tiết */}
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8'>
        <Tabs
          defaultActiveKey='details'
          items={[
            {
              key: 'details',
              label: 'Thông số kỹ thuật',
              children: (
                <Table
                  dataSource={product.details}
                  columns={[
                    {
                      title: 'Thông số',
                      dataIndex: 'name',
                      key: 'name',
                      width: '30%',
                    },
                    { title: 'Giá trị', dataIndex: 'value', key: 'value' },
                  ]}
                  pagination={false}
                  rowKey='id'
                  className='border border-gray-100 rounded-lg overflow-hidden'
                />
              ),
            },
            {
              key: 'description',
              label: 'Mô tả sản phẩm',
              children: (
                <div className='prose max-w-none product-description'>
                  <div
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              ),
            },
            {
              key: 'shipping',
              label: 'Vận chuyển & Bảo hành',
              children: (
                <div className='space-y-4'>
                  <div>
                    <Typography.Title level={5}>
                      Thông tin vận chuyển
                    </Typography.Title>
                    <ul className='list-disc pl-5'>
                      <li>
                        Giao hàng nhanh trong vòng 24h tại nội thành Hà Nội và
                        TP.HCM
                      </li>
                      <li>
                        Giao hàng tiêu chuẩn từ 2-5 ngày cho các tỉnh thành khác
                      </li>
                      <li>Miễn phí giao hàng cho đơn hàng từ 500.000đ</li>
                    </ul>
                  </div>
                  <div>
                    <Typography.Title level={5}>
                      Chính sách bảo hành
                    </Typography.Title>
                    <ul className='list-disc pl-5'>
                      <li>Bảo hành chính hãng 12 tháng</li>
                      <li>
                        Đổi trả miễn phí trong 7 ngày nếu lỗi nhà sản xuất
                      </li>
                      <li>Hỗ trợ kỹ thuật trọn đời</li>
                    </ul>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Đánh giá sản phẩm */}
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8'>
        <Typography.Title level={3} className='mb-6'>
          Đánh giá từ khách hàng
        </Typography.Title>
        <ProductReviews
          productId={product.id}
          averageRating={product.averageRating}
          reviewCount={product.reviewCount}
        />
      </div>
    </div>
  )
}

export default ProductDetailPage
