import React, { useEffect, useState, useRef } from 'react'
import {
  Carousel,
  Card,
  Button,
  Row,
  Col,
  Rate,
  Tag,
  Typography,
  Statistic,
} from 'antd'
import {
  ShoppingCartOutlined,
  FireOutlined,
  TrophyOutlined,
  StarOutlined,
  DollarOutlined,
  RightOutlined,
  ThunderboltOutlined,
  LeftOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../config/appConfig'
import { createRoute, useRoutes } from '../../hooks/useRoutes'
import {
  ProductListResponse,
  ProductFilterType,
} from '../../types/productTypes'
import {
  CategoryItem,
  PromoBanner,
  mockCategories,
  mockPromoBanners,
} from '../../mock/homeData'
import productService from '../../services/productService'
import carouselService from '../../services/carouselService'
import { CarouselImageResponse } from '../../types/carouselTypes'
import { useCart } from '../../contexts/CartContext'
import { message } from 'antd'
import { CategoryResponse } from '../../types/categoryTypes'
import categoryService from '../../services/categoryService'

const { Title, Paragraph } = Typography

const HomePage: React.FC = () => {
  const [bestSellers, setBestSellers] = useState<ProductListResponse[]>([])
  const [trending, setTrending] = useState<ProductListResponse[]>([])
  const [highRated, setHighRated] = useState<ProductListResponse[]>([])
  const [discounted, setDiscounted] = useState<ProductListResponse[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [carouselItems, setCarouselItems] = useState<CarouselImageResponse[]>(
    []
  )
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([])

  const [bestSellersLoading, setBestSellersLoading] = useState(false)
  const [trendingLoading, setTrendingLoading] = useState(false)
  const [highRatedLoading, setHighRatedLoading] = useState(false)
  const [discountedLoading, setDiscountedLoading] = useState(false)
  const [loadingProductIds, setLoadingProductIds] = useState<number[]>([])

  const bestSellerRef = useRef<HTMLDivElement>(null)
  const trendingRef = useRef<HTMLDivElement>(null)
  const highRatedRef = useRef<HTMLDivElement>(null)
  const discountedRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()
  const { navigateTo } = useRoutes()

  const { addToCart } = useCart()

  const handleAddToCart = async (product: ProductListResponse) => {
    // Prevent duplicate calls by checking if product is already being added
    if (loadingProductIds.includes(product.id)) return

    try {
      setLoadingProductIds((prev) => [...prev, product.id])
      await addToCart({
        productId: product.id,
        quantity: 1,
      })
      // The message is already shown by CartContext
      // message.success(`Đã thêm ${product.name} vào giỏ hàng`)
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error)
      message.error('Không thể thêm sản phẩm vào giỏ hàng')
    } finally {
      setLoadingProductIds((prev) => prev.filter((id) => id !== product.id))
    }
  }

  const getBadgeContent = (productType: ProductFilterType) => {
    // Using className instead of inline styles to avoid TypeScript issues
    const badgeClassName =
      'absolute z-10 right-[10px] top-[10px] font-bold px-2 py-1 flex items-center gap-1 shadow-md border-none'

    switch (productType) {
      case ProductFilterType.BEST_SELLER:
        return (
          <Tag color='red' className={`${badgeClassName} animate-pulse`}>
            <TrophyOutlined /> Bán chạy
          </Tag>
        )
      case ProductFilterType.TRENDING:
        return (
          <Tag color='volcano' className={`${badgeClassName} animate-pulse`}>
            <FireOutlined /> Xu hướng
          </Tag>
        )
      case ProductFilterType.HIGH_RATED:
        return (
          <Tag color='gold' className={badgeClassName}>
            <StarOutlined /> Đánh giá cao
          </Tag>
        )
      case ProductFilterType.DISCOUNTED:
        return (
          <Tag color='green' className={`${badgeClassName} animate-pulse`}>
            <DollarOutlined /> Giảm giá sốc
          </Tag>
        )
      default:
        return null
    }
  }

  const ProductCard: React.FC<{
    product: ProductListResponse
    productType: ProductFilterType
  }> = ({ product, productType }) => (
    <Card
      hoverable
      cover={
        <div className='relative pt-[75%]'>
          <img
            alt={product.name}
            src={product.mainImage}
            className='absolute top-0 left-0 w-full h-full object-cover'
          />
          {getBadgeContent(productType)}
          {product.discountPercent > 0 && (
            <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center justify-center min-w-[40px] h-[24px] z-10'>
              -{product.discountPercent}%
            </div>
          )}
        </div>
      }
      bodyStyle={{ padding: '12px 16px' }}
      onClick={() =>
        navigate(createRoute(ROUTES.PRODUCT_DETAIL, { id: product.id }))
      }
    >
      <div className='h-12 overflow-hidden mb-2'>
        <Card.Meta
          title={
            <span className='text-sm font-medium leading-tight line-clamp-2'>
              {product.name}
            </span>
          }
        />
      </div>
      <div className='flex items-center mb-2'>
        <div className='flex items-center'>
          <Rate
            disabled
            defaultValue={product.averageRating}
            allowHalf
            className='text-sm'
          />
          <span className='ml-1 text-xs text-gray-500'>
            ({product.reviewCount || 0})
          </span>
        </div>
      </div>
      <div className='flex items-baseline justify-between'>
        <div>
          {product.discountPercent > 0 && (
            <span className='text-xs text-gray-400 line-through mr-2'>
              {product.price.toLocaleString('vi-VN')}₫
            </span>
          )}
          <span className='text-base font-bold text-red-500'>
            {product.discountPrice.toLocaleString('vi-VN')}₫
          </span>
        </div>
        <Button
          type='primary'
          className='flex items-center justify-center h-8 w-8'
          shape='circle'
          icon={<ShoppingCartOutlined style={{ fontSize: '16px' }} />}
          loading={loadingProductIds.includes(product.id)}
          disabled={loadingProductIds.includes(product.id)}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleAddToCart(product)
          }}
        />
      </div>
    </Card>
  )

  const renderProductSection = (
    title: string,
    products: ProductListResponse[],
    productType: ProductFilterType,
    viewAllLink: string,
    loading: boolean = false,
    containerRef: React.RefObject<HTMLDivElement | null>
  ) => {
    if (products.length === 0 && !loading) {
      return null
    }

    const getViewAllLink = () => `${viewAllLink}?filterType=${productType}`

    const handleScroll = (direction: 'left' | 'right') => {
      if (containerRef.current) {
        const scrollAmount = direction === 'left' ? -800 : 800
        containerRef.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        })
      }
    }

    return (
      <div className='mb-12'>
        <div className='flex justify-between items-center mb-4'>
          <Title level={3} className='!m-0'>
            {title}
          </Title>
          <Button
            type='link'
            onClick={() => navigate(getViewAllLink())}
            className='font-medium'
          >
            Xem tất cả <RightOutlined />
          </Button>
        </div>

        <div className='relative'>
          <Button
            className='absolute left-0 top-1/2 -translate-y-1/2 z-10 shadow-md'
            shape='circle'
            icon={<LeftOutlined />}
            onClick={() => handleScroll('left')}
          />

          {loading ? (
            <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
              {Array(4)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className='flex-shrink-0'
                    style={{ width: 'calc(25% - 12px)' }}
                  >
                    <Card loading={true} className='w-full h-full' />
                  </div>
                ))}
            </div>
          ) : (
            <div
              ref={containerRef}
              className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className='flex-shrink-0'
                  style={{ width: 'calc(25% - 12px)' }}
                >
                  <ProductCard product={product} productType={productType} />
                </div>
              ))}
            </div>
          )}

          <Button
            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 shadow-md'
            shape='circle'
            icon={<RightOutlined />}
            onClick={() => handleScroll('right')}
          />
        </div>
      </div>
    )
  }

  const renderCategories = () => {
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await categoryService.getRootCategories({
            page: 0,
            size: 10,
          })
          setCategories(response.content)
        } catch (error) {
          console.error('Error fetching categories:', error)
        }
      }
      fetchCategories()
    }, [])

    return (
      <div className='mb-12'>
        <Title level={3} style={{ marginBottom: 24 }}>
          Danh mục nổi bật
        </Title>
        <Row gutter={[16, 16]}>
          {categories.map((category) => (
            <Col key={category.id} xs={12} sm={8} md={6} lg={4}>
              <Card
                hoverable
                style={{ textAlign: 'center' }}
                cover={
                  <div style={{ padding: '20px 0 10px' }}>
                    <img
                      alt={category.name}
                      src={category.image}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'contain',
                        margin: '0 auto',
                      }}
                    />
                  </div>
                }
                bodyStyle={{ padding: '10px' }}
                onClick={() =>
                  navigateTo(
                    ROUTES.PRODUCTS,
                    {},
                    { categoryIds: [category.id] }
                  )
                }
              >
                <Typography.Paragraph
                  style={{ margin: 0, fontSize: 14, fontWeight: 500 }}
                >
                  {category.name}
                </Typography.Paragraph>
                <Typography.Text type='secondary' style={{ fontSize: 12 }}>
                  {category.productCount} sản phẩm
                </Typography.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    )
  }

  const renderPromoBanners = () => (
    <div className='mb-12'>
      <Row gutter={[16, 16]}>
        {promoBanners.map((banner) => (
          <Col key={banner.id} xs={24} md={8}>
            <Card
              hoverable
              style={{
                height: '100%',
                background: banner.color,
                borderRadius: '12px',
                overflow: 'hidden',
                border: 'none',
              }}
              bodyStyle={{ padding: '24px' }}
              onClick={() =>
                navigate(
                  banner.link.startsWith('/')
                    ? banner.link
                    : createRoute(ROUTES.HOME)
                )
              }
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <Typography.Title
                  level={4}
                  style={{ color: '#fff', margin: 0 }}
                >
                  {banner.title}
                </Typography.Title>
                <Typography.Paragraph
                  style={{ color: '#fff', opacity: 0.9, marginTop: 8 }}
                >
                  {banner.description}
                </Typography.Paragraph>
                <div style={{ marginTop: 'auto' }}>
                  <Button type='default' ghost>
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )

  const renderStats = () => (
    <div
      className='mb-12 py-8'
      style={{ background: '#f5f5f5', borderRadius: '12px' }}
    >
      <Row gutter={0} justify='space-around' align='middle'>
        <Col span={6} style={{ textAlign: 'center' }}>
          <Statistic
            title={<span style={{ fontSize: 16 }}>Sản phẩm</span>}
            value={5000}
            suffix='+'
            valueStyle={{ color: '#1677ff' }}
          />
        </Col>
        <Col span={6} style={{ textAlign: 'center' }}>
          <Statistic
            title={<span style={{ fontSize: 16 }}>Khách hàng</span>}
            value={25000}
            suffix='+'
            valueStyle={{ color: '#1677ff' }}
          />
        </Col>
        <Col span={6} style={{ textAlign: 'center' }}>
          <Statistic
            title={<span style={{ fontSize: 16 }}>Đơn hàng</span>}
            value={120000}
            suffix='+'
            valueStyle={{ color: '#1677ff' }}
          />
        </Col>
        <Col span={6} style={{ textAlign: 'center' }}>
          <Statistic
            title={<span style={{ fontSize: 16 }}>Đánh giá</span>}
            value={4.8}
            suffix='/5'
            precision={1}
            valueStyle={{ color: '#1677ff' }}
          />
        </Col>
      </Row>
    </div>
  )

  const renderFlashSale = () => (
    <div className='mb-12'>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex items-center'>
          <ThunderboltOutlined className='text-2xl text-red-500 mr-3' />
          <Title level={3} className='!m-0 !text-red-500'>
            Flash Sale
          </Title>
        </div>
        <Button
          type='link'
          size='large'
          onClick={() =>
            navigate(
              createRoute(ROUTES.PRODUCTS, {
                filterType: ProductFilterType.DISCOUNTED,
              })
            )
          }
          icon={<RightOutlined />}
          className='text-red-500 hover:text-red-600'
        >
          Xem tất cả
        </Button>
      </div>

      <div className='relative'>
        {/* Nút điều hướng trái */}
        <Button
          className='absolute left-0 top-1/2 -translate-y-1/2 z-10 shadow-md'
          shape='circle'
          icon={<LeftOutlined />}
          onClick={() => {
            const container = document.getElementById(
              'product-carousel-flash-sale'
            )
            if (container) {
              container.scrollBy({ left: -800, behavior: 'smooth' })
            }
          }}
        />

        {/* Container cho sản phẩm có thể cuộn ngang */}
        <div
          id='product-carousel-flash-sale'
          className='flex overflow-x-auto pb-4 hide-scrollbar'
          style={{
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
        >
          {discounted.map((product) => (
            <div
              key={product.id}
              className='flex-shrink-0'
              style={{ width: 'calc(100% / 4 - 16px)', marginRight: '16px' }}
            >
              <ProductCard
                product={product}
                productType={ProductFilterType.DISCOUNTED}
              />
            </div>
          ))}
        </div>

        {/* Nút điều hướng phải */}
        <Button
          className='absolute right-0 top-1/2 -translate-y-1/2 z-10 shadow-md'
          shape='circle'
          icon={<RightOutlined />}
          onClick={() => {
            const container = document.getElementById(
              'product-carousel-flash-sale'
            )
            if (container) {
              container.scrollBy({ left: 800, behavior: 'smooth' })
            }
          }}
        />
      </div>
    </div>
  )

  const renderIntro = () => (
    <div className='mb-12 py-8' style={{ textAlign: 'center' }}>
      <Title level={2}>ShopMe - Mua sắm thông minh, sống chất lượng</Title>
      <Paragraph style={{ fontSize: 16, maxWidth: '800px', margin: '0 auto' }}>
        ShopMe tự hào là điểm đến mua sắm trực tuyến hàng đầu với hàng ngàn sản
        phẩm công nghệ chính hãng. Chúng tôi cam kết mang đến cho khách hàng
        trải nghiệm mua sắm thuận tiện với dịch vụ giao hàng nhanh chóng, đổi
        trả dễ dàng và bảo hành uy tín.
      </Paragraph>
      <div style={{ margin: '24px 0' }}>
        <Button
          type='primary'
          size='large'
          onClick={() => navigate(createRoute(ROUTES.PRODUCTS))}
        >
          Khám phá ngay
        </Button>
      </div>
    </div>
  )

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch carousel data
        try {
          const carouselData = await carouselService.getCarouselImages()
          if (carouselData) {
            setCarouselItems(carouselData)
          }
        } catch (error) {
          console.error('Error fetching carousel data:', error)
        }

        // Fetch categories
        setCategories(mockCategories)

        // Fetch promo banners
        setPromoBanners(mockPromoBanners)

        const defaultParams = {
          page: 0,
          size: 10,
        }

        setBestSellersLoading(true)
        try {
          const bestSellerData = await productService.listByPage({
            ...defaultParams,
            filterType: ProductFilterType.BEST_SELLER,
          })
          if (bestSellerData && bestSellerData.content) {
            setBestSellers(bestSellerData.content)
          }
        } catch (error) {
          console.error('Error fetching best sellers:', error)
        } finally {
          setBestSellersLoading(false)
        }

        setTrendingLoading(true)
        try {
          const trendingData = await productService.listByPage({
            ...defaultParams,
            filterType: ProductFilterType.TRENDING,
          })
          if (trendingData && trendingData.content) {
            setTrending(trendingData.content)
          }
        } catch (error) {
          console.error('Error fetching trending products:', error)
        } finally {
          setTrendingLoading(false)
        }

        setHighRatedLoading(true)
        try {
          const highRatedData = await productService.listByPage({
            ...defaultParams,
            filterType: ProductFilterType.HIGH_RATED,
            minRating: 4,
          })
          if (highRatedData && highRatedData.content) {
            setHighRated(highRatedData.content)
          }
        } catch (error) {
          console.error('Error fetching high rated products:', error)
        } finally {
          setHighRatedLoading(false)
        }

        setDiscountedLoading(true)
        try {
          const discountedData = await productService.listByPage({
            ...defaultParams,
            filterType: ProductFilterType.DISCOUNTED,
          })
          if (discountedData && discountedData.content) {
            setDiscounted(discountedData.content)
          }
        } catch (error) {
          console.error('Error fetching discounted products:', error)
        } finally {
          setDiscountedLoading(false)
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu trang chủ:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className='container mx-auto px-4'>
      {/* Hero Carousel */}
      <div className='mb-12'>
        <Carousel autoplay effect='fade'>
          {carouselItems.map((item) => (
            <div key={item.id}>
              <div className='relative h-[400px] rounded-[8px] overflow-hidden'>
                <img
                  src={item.image}
                  // src=""
                  alt={item.name}
                  className='absolute top-0 left-0 w-full h-full object-cover'
                />
                <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center p-[0_10%]'>
                  <Typography.Title
                    level={1}
                    className='text-white mb-4 !text-white'
                    style={{ color: 'white' }}
                  >
                    {item.name}
                  </Typography.Title>
                  <Typography.Paragraph className='text-white text-[18px] mb-6'>
                    {item.content}
                  </Typography.Paragraph>
                  <Button
                    type='primary'
                    size='large'
                    onClick={() => navigate(createRoute(ROUTES.HOME))}
                  >
                    Xem ngay
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Danh mục nổi bật */}
      {renderCategories()}

      {/* Flash Sale */}
      {renderFlashSale()}

      {/* Banner quảng cáo */}
      {renderPromoBanners()}

      {/* Thống kê */}
      {renderStats()}

      {/* Product Sections */}
      {renderProductSection(
        'Sản phẩm bán chạy',
        bestSellers,
        ProductFilterType.BEST_SELLER,
        createRoute(ROUTES.PRODUCTS, {
          filterType: ProductFilterType.BEST_SELLER,
        }),
        bestSellersLoading,
        bestSellerRef
      )}
      {renderProductSection(
        'Xu hướng mua sắm',
        trending,
        ProductFilterType.TRENDING,
        createRoute(ROUTES.PRODUCTS, {
          filterType: ProductFilterType.TRENDING,
        }),
        trendingLoading,
        trendingRef
      )}
      {renderProductSection(
        'Đánh giá cao nhất',
        highRated,
        ProductFilterType.HIGH_RATED,
        createRoute(ROUTES.PRODUCTS, {
          filterType: ProductFilterType.HIGH_RATED,
        }),
        highRatedLoading,
        highRatedRef
      )}
      {renderProductSection(
        'Giảm giá sốc',
        discounted,
        ProductFilterType.DISCOUNTED,
        createRoute(ROUTES.PRODUCTS, {
          filterType: ProductFilterType.DISCOUNTED,
        }),
        discountedLoading,
        discountedRef
      )}

      {/* Phần giới thiệu */}
      {renderIntro()}
    </div>
  )
}

export default HomePage
