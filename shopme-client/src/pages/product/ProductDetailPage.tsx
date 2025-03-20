import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Breadcrumb,
  Carousel,
  Tabs,
  Descriptions,
  Tag,
  Button,
  Spin,
  Image,
} from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { ProductDetailResponse } from '../../types/productTypes'
import productService from '../../services/productService'
import AddToCartButton from '../../components/cart/AddToCartButton'

const ProductDetailPage: React.FC = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<ProductDetailResponse | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')

  useEffect(() => {
    fetchProductDetail()
  }, [id])

  const fetchProductDetail = async () => {
    setLoading(true)
    try {
      const result = await productService.getProductById(Number(id))
      setProduct(result)
      setSelectedImage(result.mainImage)
    } catch (error) {
      console.error('Error fetching product detail:', error)
    }
    setLoading(false)
  }

  const calculateDiscountedPrice = (price: number, discountPercent: number) => {
    return price * (1 - discountPercent / 100)
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
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-800'>
            Không tìm thấy sản phẩm
          </h1>
          <Link to='/' className='text-primary hover:text-primary-dark'>
            Quay về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    ...product.breadcrumbs.map((category) => {
      return {
        title: <Link to={`/categories/${category.id}`}>{category.name}</Link>,
      }
    }),
    {
      title: product.name,
    },
  ]

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Breadcrumb */}
      <Breadcrumb className='mb-8' items={breadcrumbItems} />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
        {/* Product Images */}
        <div>
          <div className='mb-4'>
            <Image
              src={selectedImage || product.mainImage}
              alt={product.name}
              className='w-full rounded-lg'
            />
          </div>
          <div className='grid grid-cols-5 gap-2'>
            <div
              className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                selectedImage === product.mainImage
                  ? 'border-primary'
                  : 'border-transparent'
              }`}
              onClick={() => setSelectedImage(product.mainImage)}
            >
              <img
                src={product.mainImage}
                alt='Main'
                className='w-full h-20 object-cover'
              />
            </div>
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                  selectedImage === image
                    ? 'border-primary'
                    : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`${index + 1}`}
                  className='w-full h-20 object-cover'
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className='text-3xl font-bold text-gray-800 mb-4'>
            {product.name}
          </h1>

          <div className='mb-6'>
            <div className='text-lg text-gray-500 mb-2'>
              Thương hiệu: {product.brand}
            </div>
            <div className='text-lg text-gray-500 mb-4'>
              Danh mục: {product.category}
            </div>

            {product.discountPercent > 0 ? (
              <div>
                <div className='text-gray-400 line-through text-xl'>
                  {product.price.toLocaleString('vi-VN')}đ
                </div>
                <div className='text-primary text-3xl font-bold'>
                  {calculateDiscountedPrice(
                    product.price,
                    product.discountPercent
                  ).toLocaleString('vi-VN')}
                  đ
                </div>
                <Tag color='red' className='mt-2'>
                  -{product.discountPercent}%
                </Tag>
              </div>
            ) : (
              <div className='text-primary text-3xl font-bold'>
                {product.price.toLocaleString('vi-VN')}đ
              </div>
            )}
          </div>

          <div className='mb-6'>
            <Tag color={product.inStock ? 'success' : 'error'}>
              {product.inStock ? 'Còn hàng' : 'Hết hàng'}
            </Tag>
          </div>

          <div className='mb-6'>
            <p className='text-gray-600'>{product.shortDescription}</p>
          </div>

          {/* <Button
            type='primary'
            size='large'
            icon={<ShoppingCartOutlined />}
            disabled={!product.inStock}
          >
            Thêm vào giỏ hàng
          </Button> */}
          <AddToCartButton productId={product.id} />
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs
        defaultActiveKey='description'
        items={[
          {
            key: 'description',
            label: 'Mô tả sản phẩm',
            children: (
              <div
                className='prose max-w-none'
                dangerouslySetInnerHTML={{ __html: product.fullDescription }}
              />
            ),
          },
          {
            key: 'specifications',
            label: 'Thông số kỹ thuật',
            children: (
              <Descriptions bordered column={1}>
                {product.details.map((detail) => (
                  <Descriptions.Item key={detail.id} label={detail.name}>
                    {detail.value}
                  </Descriptions.Item>
                ))}
                <Descriptions.Item label='Kích thước'>
                  {product.length} x {product.width} x {product.height} cm
                </Descriptions.Item>
                <Descriptions.Item label='Khối lượng'>
                  {product.weight} kg
                </Descriptions.Item>
              </Descriptions>
            ),
          },
        ]}
      />
    </div>
  )
}

export default ProductDetailPage
