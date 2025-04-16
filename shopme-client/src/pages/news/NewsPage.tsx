import React, { useState, useEffect } from 'react'
import { Typography, Row, Col, Card, Pagination, Tag, Breadcrumb, Input, Divider, Skeleton, List } from 'antd'
import { Link } from 'react-router-dom'
import {
  CalendarOutlined,
  UserOutlined,
  TagOutlined,
  SearchOutlined,
  RightOutlined,
  EyeOutlined,
  LikeOutlined,
  CommentOutlined,
} from '@ant-design/icons'
import { ROUTES } from '../../config/appConfig'

const { Title, Paragraph } = Typography
const { Search } = Input

// Mock data cho tin tức
const mockNewsCategories = [
  { id: 1, name: 'Tin công nghệ', count: 15, alias: 'tin-cong-nghe' },
  { id: 2, name: 'Khuyến mãi', count: 8, alias: 'khuyen-mai' },
  { id: 3, name: 'Hướng dẫn mua hàng', count: 6, alias: 'huong-dan-mua-hang' },
  { id: 4, name: 'Đánh giá sản phẩm', count: 12, alias: 'danh-gia-san-pham' },
  { id: 5, name: 'Thông báo', count: 4, alias: 'thong-bao' },
]

const mockPopularTags = [
  { id: 1, name: 'iPhone', count: 12 },
  { id: 2, name: 'Samsung', count: 10 },
  { id: 3, name: 'Laptop', count: 8 },
  { id: 4, name: 'Khuyến mãi', count: 15 },
  { id: 5, name: 'Đánh giá', count: 7 },
  { id: 6, name: 'Mẹo hay', count: 5 },
]

const mockNewsItems = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max - Đánh giá chi tiết sau 1 tháng sử dụng',
    summary: 'Sau 1 tháng trải nghiệm, iPhone 15 Pro Max đã chứng minh được vị thế flagship của Apple với nhiều cải tiến đáng giá.',
    content: 'Nội dung chi tiết về iPhone 15 Pro Max...',
    image: 'https://picsum.photos/800/450',
    category: { id: 1, name: 'Tin công nghệ', alias: 'tin-cong-nghe' },
    author: 'Admin',
    date: '28/03/2025',
    tags: ['iPhone', 'Apple', 'Đánh giá'],
    views: 1250,
    likes: 87,
    comments: 32,
  },
  {
    id: 2,
    title: 'Top 5 laptop gaming đáng mua nhất năm 2025',
    summary: 'Tổng hợp những mẫu laptop gaming có hiệu năng mạnh mẽ, thiết kế ấn tượng và mức giá hợp lý nhất trong năm 2025.',
    content: 'Nội dung chi tiết về top 5 laptop gaming...',
    image: 'https://picsum.photos/800/451',
    category: { id: 4, name: 'Đánh giá sản phẩm', alias: 'danh-gia-san-pham' },
    author: 'Tech Expert',
    date: '25/03/2025',
    tags: ['Laptop', 'Gaming', 'Đánh giá'],
    views: 980,
    likes: 65,
    comments: 18,
  },
  {
    id: 3,
    title: 'Flash Sale tháng 4 - Giảm đến 50% cho tất cả sản phẩm',
    summary: 'Chương trình khuyến mãi lớn nhất trong năm với nhiều ưu đãi hấp dẫn cho khách hàng mua sắm online.',
    content: 'Nội dung chi tiết về chương trình Flash Sale...',
    image: 'https://picsum.photos/800/452',
    category: { id: 2, name: 'Khuyến mãi', alias: 'khuyen-mai' },
    author: 'Marketing Team',
    date: '20/03/2025',
    tags: ['Khuyến mãi', 'Flash Sale', 'Giảm giá'],
    views: 2100,
    likes: 145,
    comments: 56,
  },
  {
    id: 4,
    title: 'Hướng dẫn chọn mua điện thoại phù hợp với nhu cầu',
    summary: 'Những tiêu chí quan trọng cần cân nhắc khi lựa chọn một chiếc điện thoại mới phù hợp với nhu cầu sử dụng.',
    content: 'Nội dung chi tiết về hướng dẫn chọn mua điện thoại...',
    image: 'https://picsum.photos/800/453',
    category: { id: 3, name: 'Hướng dẫn mua hàng', alias: 'huong-dan-mua-hang' },
    author: 'Shopping Expert',
    date: '15/03/2025',
    tags: ['Điện thoại', 'Mẹo hay', 'Hướng dẫn'],
    views: 850,
    likes: 42,
    comments: 15,
  },
  {
    id: 5,
    title: 'So sánh chi tiết Samsung Galaxy S25 Ultra và iPhone 15 Pro Max',
    summary: 'Phân tích chi tiết ưu nhược điểm của hai flagship hàng đầu đến từ Samsung và Apple trong năm 2025.',
    content: 'Nội dung chi tiết về so sánh Samsung Galaxy S25 Ultra và iPhone 15 Pro Max...',
    image: 'https://picsum.photos/800/454',
    category: { id: 4, name: 'Đánh giá sản phẩm', alias: 'danh-gia-san-pham' },
    author: 'Tech Reviewer',
    date: '10/03/2025',
    tags: ['Samsung', 'iPhone', 'So sánh'],
    views: 1850,
    likes: 120,
    comments: 45,
  },
  {
    id: 6,
    title: 'Mở rộng hệ thống cửa hàng - ShopMe khai trương chi nhánh mới tại Đà Nẵng',
    summary: 'ShopMe tiếp tục mở rộng hệ thống cửa hàng với chi nhánh mới tại thành phố Đà Nẵng, mang đến trải nghiệm mua sắm tuyệt vời cho khách hàng miền Trung.',
    content: 'Nội dung chi tiết về khai trương chi nhánh mới...',
    image: 'https://picsum.photos/800/455',
    category: { id: 5, name: 'Thông báo', alias: 'thong-bao' },
    author: 'PR Team',
    date: '05/03/2025',
    tags: ['ShopMe', 'Cửa hàng mới', 'Đà Nẵng'],
    views: 750,
    likes: 38,
    comments: 12,
  },
]

const mockRecentPosts = [
  {
    id: 7,
    title: 'Cách sử dụng Apple Pay tại Việt Nam',
    image: 'https://picsum.photos/100/100',
    date: '01/04/2025',
  },
  {
    id: 8,
    title: 'Top 10 phụ kiện không thể thiếu cho điện thoại',
    image: 'https://picsum.photos/100/101',
    date: '30/03/2025',
  },
  {
    id: 9,
    title: 'Mẹo tiết kiệm pin cho smartphone',
    image: 'https://picsum.photos/100/102',
    date: '27/03/2025',
  },
  {
    id: 10,
    title: 'Cách bảo vệ dữ liệu cá nhân trên thiết bị di động',
    image: 'https://picsum.photos/100/103',
    date: '25/03/2025',
  },
]

const NewsPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [newsItems, setNewsItems] = useState(mockNewsItems)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const pageSize = 5

  useEffect(() => {
    // Giả lập thời gian tải dữ liệu
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    // Lọc tin tức theo từ khóa tìm kiếm
    if (value.trim()) {
      const filteredNews = mockNewsItems.filter(
        (item) =>
          item.title.toLowerCase().includes(value.toLowerCase()) ||
          item.summary.toLowerCase().includes(value.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(value.toLowerCase()))
      )
      setNewsItems(filteredNews)
    } else {
      setNewsItems(mockNewsItems)
    }
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Phân trang
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const displayedNews = newsItems.slice(startIndex, endIndex)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6" items={[
        { title: <Link to={ROUTES.HOME}>Trang chủ</Link> },
        { title: 'Tin tức' },
      ]} />

      <Row gutter={[32, 24]}>
        {/* Main content */}
        <Col xs={24} md={16}>
          <div className="mb-6">
            <Title level={2}>Tin tức mới nhất</Title>
            <Divider />
          </div>

          {loading ? (
            // Skeleton loading
            Array(3).fill(null).map((_, index) => (
              <div key={index} className="mb-8">
                <Skeleton active avatar paragraph={{ rows: 4 }} />
              </div>
            ))
          ) : (
            // News list
            displayedNews.map((news) => (
              <div key={news.id} className="mb-8">
                <Card
                  hoverable
                  className="overflow-hidden"
                  cover={
                    <div className="overflow-hidden" style={{ maxHeight: '300px' }}>
                      <img
                        alt={news.title}
                        src={news.image}
                        className="w-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  }
                >
                  <Link to={`/tin-tuc/${news.id}`}>
                    <Title level={3} className="hover:text-primary transition-colors">
                      {news.title}
                    </Title>
                  </Link>
                  
                  <div className="flex items-center text-gray-500 mb-4 text-sm flex-wrap gap-y-2">
                    <Link to={`/tin-tuc/danh-muc/${news.category.alias}`} className="mr-4 hover:text-primary">
                      <TagOutlined className="mr-1" /> {news.category.name}
                    </Link>
                    <span className="mr-4">
                      <CalendarOutlined className="mr-1" /> {news.date}
                    </span>
                    <span className="mr-4">
                      <UserOutlined className="mr-1" /> {news.author}
                    </span>
                    <span className="mr-4">
                      <EyeOutlined className="mr-1" /> {news.views} lượt xem
                    </span>
                    <span className="mr-4">
                      <LikeOutlined className="mr-1" /> {news.likes}
                    </span>
                    <span>
                      <CommentOutlined className="mr-1" /> {news.comments}
                    </span>
                  </div>
                  
                  <Paragraph className="text-gray-600">
                    {news.summary}
                  </Paragraph>
                  
                  <div className="mt-4">
                    <Link to={`/tin-tuc/${news.id}`} className="text-primary hover:text-primary-dark font-medium">
                      Đọc tiếp <RightOutlined />
                    </Link>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {news.tags.map((tag, index) => (
                      <Link key={index} to={`/tin-tuc/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Tag color="blue">{tag}</Tag>
                      </Link>
                    ))}
                  </div>
                </Card>
              </div>
            ))
          )}

          {/* Pagination */}
          {!loading && newsItems.length > 0 && (
            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                total={newsItems.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}

          {/* No results */}
          {!loading && newsItems.length === 0 && (
            <div className="text-center py-10">
              <Title level={4} className="text-gray-500">
                Không tìm thấy bài viết nào phù hợp với từ khóa "{searchValue}"
              </Title>
            </div>
          )}
        </Col>

        {/* Sidebar */}
        <Col xs={24} md={8}>
          {/* Search */}
          <div className="mb-8">
            <Title level={4}>Tìm kiếm</Title>
            <Search
              placeholder="Nhập từ khóa tìm kiếm..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
            />
          </div>

          {/* Categories */}
          <div className="mb-8">
            <Title level={4}>Danh mục</Title>
            <List
              itemLayout="horizontal"
              dataSource={mockNewsCategories}
              renderItem={(item) => (
                <List.Item>
                  <Link
                    to={`/tin-tuc/danh-muc/${item.alias}`}
                    className="w-full flex justify-between items-center text-gray-700 hover:text-primary"
                  >
                    <span>{item.name}</span>
                    <span className="text-gray-500">({item.count})</span>
                  </Link>
                </List.Item>
              )}
            />
          </div>

          {/* Recent posts */}
          <div className="mb-8">
            <Title level={4}>Bài viết gần đây</Title>
            <List
              itemLayout="horizontal"
              dataSource={mockRecentPosts}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/tin-tuc/${item.id}`} className="flex gap-4 w-full hover:text-primary">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-gray-500 text-sm">
                        <CalendarOutlined className="mr-1" /> {item.date}
                      </div>
                    </div>
                  </Link>
                </List.Item>
              )}
            />
          </div>

          {/* Tags */}
          <div className="mb-8">
            <Title level={4}>Thẻ phổ biến</Title>
            <div className="flex flex-wrap gap-2">
              {mockPopularTags.map((tag) => (
                <Link key={tag.id} to={`/tin-tuc/tag/${tag.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Tag color="blue" className="px-3 py-1 text-sm mb-2">
                    {tag.name} ({tag.count})
                  </Tag>
                </Link>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default NewsPage
