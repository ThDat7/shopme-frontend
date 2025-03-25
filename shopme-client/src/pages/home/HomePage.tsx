import React, { useEffect, useState } from 'react'
import { Carousel, Card, Button, Row, Col, Rate, Tag, Typography } from 'antd'
import {
  RightOutlined,
  ShoppingCartOutlined,
  FireOutlined,
  TrophyOutlined,
  StarOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../config/appConfig'
import {
  ProductListParams,
  ProductListResponse,
} from '../../types/productTypes'
import productService from '../../services/productService'

const { Title } = Typography

const HomePage: React.FC = () => {
  const [bestSellers, setBestSellers] = useState<ProductListResponse[]>([])
  const [trending, setTrending] = useState<ProductListResponse[]>([])
  const [highRated, setHighRated] = useState<ProductListResponse[]>([])
  const [discounted, setDiscounted] = useState<ProductListResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [defaultParams, setDefaultParams] = useState<ProductListParams>({
    page: 0,
    size: 5,
  })

  const featuredProducts = [
    {
      id: 1,
      name: 'Sản phẩm 1',
      price: '999.000đ',
      image:
        'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fc9f534c1398dac499304d_commercial_search-p-1080.jpg',
    },
    {
      id: 2,
      name: 'Sản phẩm 2',
      price: '1.299.000đ',
      image:
        'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fc9f534c1398dac499304d_commercial_search-p-1080.jpg',
    },
    {
      id: 3,
      name: 'Sản phẩm 3',
      price: '799.000đ',
      image:
        'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fc9f534c1398dac499304d_commercial_search-p-1080.jpg',
    },
    {
      id: 4,
      name: 'Sản phẩm 4',
      price: '1.499.000đ',
      image:
        'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fc9f534c1398dac499304d_commercial_search-p-1080.jpg',
    },
  ]

  const categories = [
    {
      id: 1,
      name: 'Điện tử',
      image: 'https://via.placeholder.com/400x200',
    },
    {
      id: 2,
      name: 'Thời trang',
      image: 'https://via.placeholder.com/400x200',
    },
    {
      id: 3,
      name: 'Nhà cửa',
      image: 'https://via.placeholder.com/400x200',
    },
    {
      id: 4,
      name: 'Làm đẹp',
      image: 'https://via.placeholder.com/400x200',
    },
  ]

  useEffect(() => {
    const fetchBestSellers = async () => {
      const data = await productService.listBestSeller(defaultParams)
      setBestSellers(data.content)
    }

    const fetchTrending = async () => {
      const data = await productService.listTrending(defaultParams)
      setTrending(data.content)
    }

    const fetchHighRated = async () => {
      const data = await productService.listHighRated(defaultParams)
      setHighRated(data.content)
    }

    const fetchDiscounted = async () => {
      const data = await productService.listDiscounted(defaultParams)
      setDiscounted(data.content)
    }

    fetchBestSellers()
    fetchTrending()
    fetchHighRated()
    fetchDiscounted()
  }, [])

  const navigate = useNavigate()

  const getBadgeContent = (type: string) => {
    switch (type) {
      case 'bestSeller':
        return (
          <Tag color='red' style={{ position: 'absolute', top: 10, right: 10 }}>
            <TrophyOutlined /> Best Seller
          </Tag>
        )
      case 'trending':
        return (
          <Tag
            color='volcano'
            style={{ position: 'absolute', top: 10, right: 10 }}
          >
            <FireOutlined /> Trending
          </Tag>
        )
      case 'highRated':
        return (
          <Tag
            color='gold'
            style={{ position: 'absolute', top: 10, right: 10 }}
          >
            <StarOutlined /> Top Rated
          </Tag>
        )
      case 'discounted':
        return (
          <Tag
            color='green'
            style={{ position: 'absolute', top: 10, right: 10 }}
          >
            <DollarOutlined /> Hot Deal
          </Tag>
        )
      default:
        return null
    }
  }

  const ProductCard: React.FC<{
    product: ProductListResponse
    type: 'bestSeller' | 'trending' | 'highRated' | 'discounted'
  }> = ({ product, type }) => (
    <Card
      hoverable
      cover={
        <div style={{ position: 'relative', paddingTop: '75%' }}>
          <img
            alt={product.name}
            src={product.mainImage}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {getBadgeContent(type)}
          {product.discountPercent && (
            <Tag
              color='green'
              style={{ position: 'absolute', top: 10, left: 10 }}
            >
              {product.discountPercent}% OFF
            </Tag>
          )}
        </div>
      }
      bodyStyle={{ padding: '12px 16px' }}
      onClick={() => navigate(`${ROUTES.PRODUCTS}/${product.id}`)}
    >
      <Typography.Paragraph
        ellipsis={{ rows: 2 }}
        style={{ marginBottom: 8, height: 44, fontSize: 16 }}
      >
        {product.name}
      </Typography.Paragraph>
      <div style={{ marginBottom: 8 }}>
        <Rate
          disabled
          defaultValue={product.averageRating}
          style={{ fontSize: 12 }}
        />
        <span style={{ marginLeft: 8, color: '#666' }}>
          {product.averageRating.toFixed(1)}
          {` (${product.reviewCount} reviews)`}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Typography.Text type='danger' strong style={{ fontSize: 18 }}>
            ${product.price.toFixed(2)}
          </Typography.Text>
          {product.discountPercent > 0 && (
            <Typography.Text delete type='secondary' style={{ marginLeft: 8 }}>
              ${product.discountPrice.toFixed(2)}
            </Typography.Text>
          )}
        </div>
        <Button
          type='primary'
          icon={<ShoppingCartOutlined />}
          size='small'
          onClick={(e) => {
            e.stopPropagation()
            // Add to cart logic here
          }}
        >
          Add
        </Button>
      </div>
      <Typography.Text type='secondary' style={{ fontSize: 12 }}>
        {product.saleCount} sold{type === 'trending' && ' this week'}
      </Typography.Text>
    </Card>
  )

  const ProductSection: React.FC<{
    title: string
    icon: React.ReactNode
    products: ProductListResponse[]
    type: 'bestSeller' | 'trending' | 'highRated' | 'discounted'
  }> = ({ title, icon, products, type }) => (
    <div style={{ marginBottom: 48 }}>
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {icon}
        <Title level={3} style={{ margin: 0 }}>
          {title}
        </Title>
      </div>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <ProductCard product={product} type={type} />
          </Col>
        ))}
      </Row>
    </div>
  )

  return (
    <div>
      {/* Hero Section */}
      <Carousel autoplay className='mb-12'>
        {[1, 2, 3].map((item) => (
          <div key={item}>
            <div
              className='h-[400px] bg-cover bg-center flex items-center'
              style={{
                backgroundImage: `url(https://www.hsbassett.co.uk/wp-content/uploads/2017/06/southern-alps-1920x400.png)`,
              }}
            >
              <div className='container mx-auto px-4'>
                <div className='max-w-lg'>
                  <h1 className='text-4xl font-bold text-white mb-4'>
                    Khám phá bộ sưu tập mới
                  </h1>
                  <p className='text-white mb-6'>
                    Những sản phẩm chất lượng cao với giá cả hợp lý
                  </p>
                  <Button type='primary' size='large'>
                    Mua ngay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      <ProductSection
        title='Sản phẩm bán chạy'
        icon={<TrophyOutlined style={{ fontSize: 24, color: '#f5222d' }} />}
        products={bestSellers}
        type='bestSeller'
      />
      <ProductSection
        title='Sản phẩm trending'
        icon={<FireOutlined style={{ fontSize: 24, color: '#fa541c' }} />}
        products={trending}
        type='trending'
      />
      <ProductSection
        title='Sản phẩm được đánh giá cao'
        icon={<StarOutlined style={{ fontSize: 24, color: '#faad14' }} />}
        products={highRated}
        type='highRated'
      />
      <ProductSection
        title='Giảm giá nhiều'
        icon={<DollarOutlined style={{ fontSize: 24, color: '#13c2c2' }} />}
        products={discounted}
        type='discounted'
      />

      {/* Newsletter */}
      <section className='bg-gray-100 py-12 mb-12'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-2xl font-bold mb-4'>Đăng ký nhận thông tin</h2>
          <p className='text-gray-600 mb-6'>
            Nhận thông tin về sản phẩm mới và khuyến mãi hấp dẫn
          </p>
          <div className='max-w-md mx-auto flex gap-4'>
            <input
              type='email'
              placeholder='Nhập email của bạn'
              className='flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary'
            />
            <Button type='primary'>Đăng ký</Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
