import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Input,
  Button,
  Form,
  Card,
  Alert,
  Space,
  Divider,
} from 'antd'
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { ROUTES } from '../../config/appConfig'
import customerService from '../../services/customerService'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const { Title, Text } = Typography

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (values: { email: string }) => {
    setLoading(true)
    try {
      await customerService.forgotPassword({ email: values.email })
      setEmail(values.email)
      setEmailSent(true)
      toast.success('Mã xác nhận đã được gửi đến email của bạn')
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate(ROUTES.RESET_PASSWORD, { state: { email } })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <Card className="max-w-md w-full shadow-lg rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <Title level={2} className="mb-2">Quên mật khẩu</Title>
            <Text type="secondary">
              {emailSent
                ? 'Kiểm tra email của bạn để lấy mã xác nhận'
                : 'Nhập email của bạn để đặt lại mật khẩu'}
            </Text>
          </div>

          {!emailSent ? (
            <>
              <Alert
                message="Hướng dẫn"
                description="Nhập email đã đăng ký của bạn. Chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu."
                type="info"
                showIcon
                className="mb-6"
              />

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                size="large"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="Email"
                    className="rounded-lg py-2"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    className="h-12 rounded-lg font-medium"
                  >
                    Gửi mã xác nhận
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : (
            <>
              <Alert
                message="Mã xác nhận đã được gửi!"
                description={`Chúng tôi đã gửi mã xác nhận đến ${email}. Vui lòng kiểm tra hộp thư đến và thư rác.`}
                type="success"
                showIcon
                className="mb-6"
              />

              <Button
                type="primary"
                block
                onClick={handleContinue}
                className="h-12 rounded-lg font-medium mb-4"
              >
                Tiếp tục đặt lại mật khẩu
              </Button>

              <Button
                type="default"
                block
                onClick={() => setEmailSent(false)}
                className="h-12 rounded-lg font-medium"
              >
                Thử lại với email khác
              </Button>
            </>
          )}

          <Divider />

          <div className="text-center">
            <Space>
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(ROUTES.LOGIN)}
                className="p-0 h-auto text-blue-500 hover:text-blue-700"
              >
                Quay lại đăng nhập
              </Button>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage