import React from 'react'
import { Carousel, Card, Button } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const HomePage: React.FC = () => {
  // Mock data - sẽ được thay thế bằng API call
  const featuredProducts = [
    {
      id: 1,
      name: 'Sản phẩm 1',
      price: '999.000đ',
      image: 'https://via.placeholder.com/300',
    },
    {
      id: 2,
      name: 'Sản phẩm 2',
      price: '1.299.000đ',
      image: 'https://via.placeholder.com/300',
    },
    {
      id: 3,
      name: 'Sản phẩm 3',
      price: '799.000đ',
      image: 'https://via.placeholder.com/300',
    },
    {
      id: 4,
      name: 'Sản phẩm 4',
      price: '1.499.000đ',
      image: 'https://via.placeholder.com/300',
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

  return (
    <div>
      {/* Hero Section */}
      <Carousel autoplay className='mb-12'>
        {[1, 2, 3].map((item) => (
          <div key={item}>
            <div
              className='h-[400px] bg-cover bg-center flex items-center'
              style={{
                backgroundImage: `url(https://via.placeholder.com/1920x400)`,
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

      {/* Featured Products */}
      <section className='container mx-auto px-4 mb-12'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold'>Sản phẩm nổi bật</h2>
          <Link
            to='/products'
            className='text-primary hover:text-primary-dark flex items-center'
          >
            Xem tất cả <RightOutlined className='ml-1' />
          </Link>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {featuredProducts.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id}>
              <Card
                hoverable
                cover={<img alt={product.name} src={product.image} />}
                className='h-full'
              >
                <Card.Meta
                  title={product.name}
                  description={
                    <span className='text-primary font-semibold'>
                      {product.price}
                    </span>
                  }
                />
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className='container mx-auto px-4 mb-12'>
        <h2 className='text-2xl font-bold mb-6'>Danh mục sản phẩm</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {categories.map((category) => (
            <Link to={`/categories/${category.id}`} key={category.id}>
              <Card
                hoverable
                cover={<img alt={category.name} src={category.image} />}
                className='h-full'
              >
                <Card.Meta title={category.name} />
              </Card>
            </Link>
          ))}
        </div>
      </section>

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
