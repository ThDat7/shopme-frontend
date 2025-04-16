import React, { useState } from 'react'
import { Typography, Row, Col, Card, Tabs, Breadcrumb, Collapse, Form, Input, Button, Divider, List, Avatar } from 'antd'
import { Link } from 'react-router-dom'
import {
  QuestionCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SendOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  RetweetOutlined,
  SafetyOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { ROUTES } from '../../config/appConfig'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { Panel } = Collapse
const { TextArea } = Input

// Mock data cho FAQ
const mockFAQs = [
  {
    question: 'Làm thế nào để đặt hàng trên ShopMe?',
    answer: 'Để đặt hàng trên ShopMe, bạn cần thực hiện các bước sau: (1) Chọn sản phẩm và thêm vào giỏ hàng, (2) Vào giỏ hàng và kiểm tra đơn hàng, (3) Nhấn "Thanh toán" và điền thông tin giao hàng, (4) Chọn phương thức thanh toán và hoàn tất đơn hàng.',
  },
  {
    question: 'Thời gian giao hàng là bao lâu?',
    answer: 'Thời gian giao hàng phụ thuộc vào khu vực của bạn. Thông thường, đơn hàng sẽ được giao trong vòng 1-3 ngày làm việc đối với khu vực nội thành và 3-5 ngày làm việc đối với khu vực ngoại thành và các tỉnh thành khác.',
  },
  {
    question: 'Chính sách đổi trả hàng như thế nào?',
    answer: 'ShopMe áp dụng chính sách đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi do nhà sản xuất hoặc không đúng mô tả. Sản phẩm đổi trả phải còn nguyên vẹn, đầy đủ phụ kiện và hóa đơn mua hàng.',
  },
  {
    question: 'Có những phương thức thanh toán nào?',
    answer: 'ShopMe hỗ trợ nhiều phương thức thanh toán như: Thanh toán khi nhận hàng (COD), Thẻ tín dụng/ghi nợ, Chuyển khoản ngân hàng, Ví điện tử (Momo, ZaloPay, VNPay), và Trả góp qua thẻ tín dụng.',
  },
  {
    question: 'Làm thế nào để theo dõi đơn hàng?',
    answer: 'Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản ShopMe và vào mục "Đơn hàng của tôi". Ngoài ra, bạn cũng có thể sử dụng tính năng "Tra cứu đơn hàng" trên trang web bằng mã đơn hàng và email/số điện thoại đặt hàng.',
  },
  {
    question: 'Tôi có thể hủy đơn hàng không?',
    answer: 'Bạn có thể hủy đơn hàng trước khi đơn hàng được xác nhận và chuyển sang trạng thái đang xử lý. Để hủy đơn hàng, vui lòng vào mục "Đơn hàng của tôi" trong tài khoản và chọn "Hủy đơn hàng" hoặc liên hệ với bộ phận Chăm sóc khách hàng.',
  },
]

// Mock data cho chính sách đổi trả
const mockReturnPolicy = {
  title: 'Chính sách đổi trả',
  content: [
    {
      title: 'Điều kiện đổi trả',
      items: [
        'Sản phẩm còn nguyên vẹn, không có dấu hiệu đã qua sử dụng',
        'Còn đầy đủ tem, nhãn, thẻ bảo hành và phụ kiện đi kèm',
        'Còn đầy đủ hộp, bao bì đóng gói ban đầu',
        'Có hóa đơn mua hàng hoặc phiếu giao hàng',
      ],
    },
    {
      title: 'Thời hạn đổi trả',
      items: [
        '7 ngày kể từ ngày nhận hàng đối với lỗi do nhà sản xuất',
        '3 ngày kể từ ngày nhận hàng đối với trường hợp sản phẩm không đúng mô tả',
        'Không áp dụng đổi trả với sản phẩm đã qua sử dụng hoặc bị hư hỏng do người dùng',
      ],
    },
    {
      title: 'Quy trình đổi trả',
      items: [
        'Liên hệ với bộ phận Chăm sóc khách hàng qua hotline 1900 1234',
        'Cung cấp thông tin đơn hàng và lý do đổi trả',
        'Nhận mã đổi trả và hướng dẫn gửi hàng',
        'Gửi sản phẩm về địa chỉ được cung cấp',
        'Nhận sản phẩm mới hoặc hoàn tiền trong vòng 7 ngày làm việc',
      ],
    },
  ],
}

// Mock data cho chính sách bảo hành
const mockWarrantyPolicy = {
  title: 'Chính sách bảo hành',
  content: [
    {
      title: 'Thời hạn bảo hành',
      items: [
        'Điện thoại, máy tính bảng, laptop: 12 tháng',
        'Phụ kiện điện tử: 6 tháng',
        'Thiết bị gia dụng: 24 tháng',
        'Thời hạn bảo hành được tính từ ngày mua hàng',
      ],
    },
    {
      title: 'Điều kiện bảo hành',
      items: [
        'Sản phẩm còn trong thời hạn bảo hành',
        'Tem bảo hành và số serial còn nguyên vẹn',
        'Lỗi kỹ thuật do nhà sản xuất',
        'Không áp dụng cho sản phẩm bị hư hỏng do sử dụng sai cách, tai nạn, thiên tai',
      ],
    },
    {
      title: 'Quy trình bảo hành',
      items: [
        'Mang sản phẩm đến trung tâm bảo hành hoặc cửa hàng ShopMe',
        'Xuất trình hóa đơn mua hàng hoặc phiếu bảo hành',
        'Nhận phiếu tiếp nhận bảo hành',
        'Thời gian xử lý bảo hành từ 7-15 ngày tùy loại sản phẩm',
      ],
    },
  ],
}

// Mock data cho hướng dẫn mua hàng
const mockShoppingGuide = [
  {
    title: 'Tìm kiếm sản phẩm',
    icon: <SearchOutlined />,
    steps: [
      'Sử dụng thanh tìm kiếm ở đầu trang',
      'Duyệt qua danh mục sản phẩm',
      'Lọc sản phẩm theo thương hiệu, giá, đánh giá',
      'Xem chi tiết sản phẩm để biết thêm thông tin',
    ],
  },
  {
    title: 'Thêm vào giỏ hàng',
    icon: <ShoppingCartOutlined />,
    steps: [
      'Chọn sản phẩm muốn mua',
      'Chọn số lượng, màu sắc, kích thước (nếu có)',
      'Nhấn nút "Thêm vào giỏ hàng"',
      'Có thể tiếp tục mua sắm hoặc thanh toán ngay',
    ],
  },
  {
    title: 'Thanh toán',
    icon: <CreditCardOutlined />,
    steps: [
      'Vào giỏ hàng và kiểm tra đơn hàng',
      'Nhấn "Thanh toán" và điền thông tin giao hàng',
      'Chọn phương thức thanh toán',
      'Xác nhận đơn hàng',
    ],
  },
  {
    title: 'Theo dõi đơn hàng',
    icon: <ClockCircleOutlined />,
    steps: [
      'Đăng nhập vào tài khoản',
      'Vào mục "Đơn hàng của tôi"',
      'Xem trạng thái đơn hàng',
      'Nhận thông báo khi đơn hàng được giao',
    ],
  },
]

const SupportPage: React.FC = () => {
  const [contactForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState('huong-dan-mua-hang')

  const handleSubmitContact = (values: any) => {
    console.log('Submitted contact form:', values)
    // Xử lý gửi form liên hệ
    contactForm.resetFields()
    // Hiển thị thông báo thành công
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6" items={[
        { title: <Link to={ROUTES.HOME}>Trang chủ</Link> },
        { title: 'Hỗ trợ' },
      ]} />

      <Title level={2} className="mb-6 text-center">
        <QuestionCircleOutlined className="mr-2 text-primary" /> Trung tâm hỗ trợ
      </Title>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        size="large"
        className="support-tabs mb-8"
      >
        <TabPane
          tab={
            <span>
              <QuestionCircleOutlined /> Hướng dẫn mua hàng
            </span>
          }
          key="huong-dan-mua-hang"
        >
          <Row gutter={[24, 24]}>
            {mockShoppingGuide.map((guide, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card className="h-full text-center">
                  <div className="text-4xl text-primary mb-4">
                    {guide.icon}
                  </div>
                  <Title level={4}>{guide.title}</Title>
                  <List
                    dataSource={guide.steps}
                    renderItem={(step, idx) => (
                      <List.Item className="border-0 px-0 py-1">
                        <Text>{idx + 1}. {step}</Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-8">
            <Title level={3}>Video hướng dẫn mua hàng</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card hoverable>
                  <div className="bg-gray-200 h-40 flex items-center justify-center mb-4">
                    <PlayCircleOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                  </div>
                  <Title level={5}>Hướng dẫn đặt hàng trên website</Title>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card hoverable>
                  <div className="bg-gray-200 h-40 flex items-center justify-center mb-4">
                    <PlayCircleOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                  </div>
                  <Title level={5}>Hướng dẫn thanh toán online</Title>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card hoverable>
                  <div className="bg-gray-200 h-40 flex items-center justify-center mb-4">
                    <PlayCircleOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                  </div>
                  <Title level={5}>Hướng dẫn đổi trả sản phẩm</Title>
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>

        <TabPane
          tab={
            <span>
              <RetweetOutlined /> Chính sách đổi trả
            </span>
          }
          key="chinh-sach-doi-tra"
        >
          <Card>
            <Title level={3}>{mockReturnPolicy.title}</Title>
            <Paragraph className="text-gray-600 mb-6">
              Chúng tôi cam kết đảm bảo sự hài lòng của khách hàng với mọi sản phẩm mua tại ShopMe. 
              Nếu bạn không hài lòng với sản phẩm đã mua, bạn có thể đổi hoặc trả lại theo chính sách dưới đây.
            </Paragraph>

            {mockReturnPolicy.content.map((section, index) => (
              <div key={index} className="mb-6">
                <Title level={4}>{section.title}</Title>
                <ul className="list-disc pl-6">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="mb-2 text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            ))}

            <Divider />

            <div className="bg-blue-50 p-4 rounded-lg">
              <Title level={5} className="text-blue-500">Lưu ý quan trọng</Title>
              <Paragraph>
                Để đảm bảo quyền lợi của mình, quý khách vui lòng kiểm tra kỹ sản phẩm trước khi ký nhận hàng. 
                Nếu có bất kỳ vấn đề gì, vui lòng liên hệ ngay với bộ phận Chăm sóc khách hàng theo số hotline 1900 1234.
              </Paragraph>
            </div>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <SafetyOutlined /> Chính sách bảo hành
            </span>
          }
          key="chinh-sach-bao-hanh"
        >
          <Card>
            <Title level={3}>{mockWarrantyPolicy.title}</Title>
            <Paragraph className="text-gray-600 mb-6">
              ShopMe cam kết cung cấp dịch vụ bảo hành chuyên nghiệp cho tất cả sản phẩm chính hãng được bán tại cửa hàng. 
              Chúng tôi đảm bảo sản phẩm của bạn sẽ được bảo hành theo đúng quy định của nhà sản xuất.
            </Paragraph>

            {mockWarrantyPolicy.content.map((section, index) => (
              <div key={index} className="mb-6">
                <Title level={4}>{section.title}</Title>
                <ul className="list-disc pl-6">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="mb-2 text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            ))}

            <Divider />

            <div className="bg-blue-50 p-4 rounded-lg">
              <Title level={5} className="text-blue-500">Trung tâm bảo hành</Title>
              <Paragraph>
                <strong>Địa chỉ:</strong> 123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh<br />
                <strong>Hotline bảo hành:</strong> 1900 1234 (Nhánh 2)<br />
                <strong>Email:</strong> warranty@shopme.vn<br />
                <strong>Thời gian làm việc:</strong> 8:00 - 20:00 (Thứ 2 - Chủ nhật)
              </Paragraph>
            </div>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <PhoneOutlined /> Liên hệ
            </span>
          }
          key="lien-he"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card className="h-full">
                <Title level={3}>Thông tin liên hệ</Title>
                <Divider />
                
                <List itemLayout="horizontal">
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<PhoneOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                      title="Hotline"
                      description="1900 1234 (8:00 - 22:00, cả thứ 7 & chủ nhật)"
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<MailOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                      title="Email"
                      description="cskh@shopme.vn"
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<EnvironmentOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                      title="Trụ sở chính"
                      description="123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh"
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<ClockCircleOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                      title="Giờ làm việc"
                      description="Thứ 2 - Chủ nhật: 8:00 - 22:00"
                    />
                  </List.Item>
                </List>

                <Divider />

                <Title level={4}>Hệ thống cửa hàng</Title>
                <List>
                  <List.Item>
                    <Text strong>Chi nhánh 1:</Text> 123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
                  </List.Item>
                  <List.Item>
                    <Text strong>Chi nhánh 2:</Text> 456 Đường Lê Văn Sỹ, Quận 3, TP. Hồ Chí Minh
                  </List.Item>
                  <List.Item>
                    <Text strong>Chi nhánh 3:</Text> 789 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội
                  </List.Item>
                  <List.Item>
                    <Text strong>Chi nhánh 4:</Text> 101 Đường Nguyễn Huệ, Quận Hải Châu, Đà Nẵng
                  </List.Item>
                </List>
              </Card>
            </Col>
            
            <Col xs={24} md={12}>
              <Card className="h-full">
                <Title level={3}>Gửi yêu cầu hỗ trợ</Title>
                <Divider />
                
                <Form
                  form={contactForm}
                  layout="vertical"
                  onFinish={handleSubmitContact}
                >
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                  >
                    <Input placeholder="Nhập họ và tên của bạn" />
                  </Form.Item>
                  
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    <Input placeholder="Nhập email của bạn" />
                  </Form.Item>
                  
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                  >
                    <Input placeholder="Nhập số điện thoại của bạn" />
                  </Form.Item>
                  
                  <Form.Item
                    name="subject"
                    label="Tiêu đề"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                  >
                    <Input placeholder="Nhập tiêu đề yêu cầu hỗ trợ" />
                  </Form.Item>
                  
                  <Form.Item
                    name="message"
                    label="Nội dung"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                  >
                    <TextArea rows={4} placeholder="Nhập nội dung yêu cầu hỗ trợ" />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SendOutlined />} size="large">
                      Gửi yêu cầu
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <QuestionCircleOutlined /> Câu hỏi thường gặp
            </span>
          }
          key="faq"
        >
          <Card>
            <Title level={3}>Câu hỏi thường gặp (FAQ)</Title>
            <Paragraph className="text-gray-600 mb-6">
              Dưới đây là những câu hỏi thường gặp từ khách hàng. Nếu bạn không tìm thấy câu trả lời cho thắc mắc của mình, 
              vui lòng liên hệ với chúng tôi qua hotline 1900 1234 hoặc email cskh@shopme.vn.
            </Paragraph>

            <Collapse accordion className="mb-8">
              {mockFAQs.map((faq, index) => (
                <Panel header={faq.question} key={index}>
                  <Paragraph>{faq.answer}</Paragraph>
                </Panel>
              ))}
            </Collapse>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Title level={4}>Bạn vẫn cần hỗ trợ thêm?</Title>
              <Paragraph className="mb-4">
                Nếu bạn không tìm thấy câu trả lời cho thắc mắc của mình, vui lòng liên hệ với chúng tôi.
              </Paragraph>
              <Button type="primary" size="large" icon={<PhoneOutlined />}>
                Gọi ngay 1900 1234
              </Button>
              <span className="mx-2">hoặc</span>
              <Button type="default" size="large" icon={<MailOutlined />}>
                Gửi email
              </Button>
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default SupportPage
