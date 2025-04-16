import React, { useState } from 'react'
import { Form, Input, Button, Divider, message, Typography, Card, Space } from 'antd'
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons'
import { CustomerLoginRequest } from '../../types/auth'
import GoogleLoginComponent from './GoogleLoginComponent'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../config/appConfig'
import { useAuth } from '../../contexts/AuthContext'
import { CustomerStatus } from '../../types/customer'
import { useRoutes } from '../../hooks/useRoutes'

const { Title, Text } = Typography

const LoginForm: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { createRoute } = useRoutes()
  const [loading, setLoading] = useState(false)
  const { login, loginWithGoogle } = useAuth()

  const onFinish = async (values: CustomerLoginRequest) => {
    setLoading(true)
    try {
      const customer = await login({
        email: values.email,
        password: values.password,
      })

      message.success('Đăng nhập thành công')

      // Xử lý điều hướng dựa trên trạng thái khách hàng
      if (customer.status === CustomerStatus.NEED_INFO) {
        navigate(createRoute(ROUTES.PROFILE))
      } else if (customer.status === CustomerStatus.UNVERIFIED) {
        navigate(createRoute(ROUTES.EMAIL_VERIFICATION))
      } else {
        navigate(createRoute(ROUTES.HOME))
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('Đăng nhập thất bại')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLoginSuccess = async (credential: string) => {
    try {
      const customer = await loginWithGoogle(credential)

      message.success('Đăng nhập thành công')

      // Xử lý điều hướng dựa trên trạng thái khách hàng
      if (customer.status === CustomerStatus.NEED_INFO) {
        navigate(createRoute(ROUTES.PROFILE))
      } else if (customer.status === CustomerStatus.UNVERIFIED) {
        navigate(createRoute(ROUTES.EMAIL_VERIFICATION))
      } else {
        navigate(createRoute(ROUTES.HOME))
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('Đăng nhập với Google thất bại')
      }
    }
  }

  return (
    <Card className='max-w-md w-full mx-auto shadow-lg rounded-lg overflow-hidden'>
      <div className='p-8'>
        <div className='text-center mb-6'>
          <Title level={2} className='mb-2'>Đăng nhập</Title>
          <Text type='secondary'>Chào mừng quay trở lại với ShopMe</Text>
        </div>
        
        <Form
          form={form}
          name='login'
          onFinish={onFinish}
          layout='vertical'
          requiredMark={false}
          size='large'
        >
          <Form.Item
            name='email'
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Vui lòng nhập email hợp lệ!' },
            ]}
          >
            <Input 
              prefix={<UserOutlined className='text-gray-400' />} 
              placeholder='Email' 
              className='rounded-lg py-2'
            />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className='text-gray-400' />}
              placeholder='Mật khẩu'
              className='rounded-lg py-2'
            />
          </Form.Item>

          <Form.Item className='mb-2'>
            <div className='flex justify-end'>
              <Button 
                type='link' 
                onClick={() => navigate(createRoute(ROUTES.FORGOT_PASSWORD))}
                className='p-0 h-auto text-blue-500 hover:text-blue-700'
              >
                Quên mật khẩu?
              </Button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              block
              loading={loading}
              icon={<LoginOutlined />}
              className='h-12 rounded-lg font-medium'
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>Hoặc đăng nhập với</Divider>

        <div className='flex justify-center mb-6'>
          <GoogleLoginComponent onLoginSuccess={handleGoogleLoginSuccess} />
        </div>

        <div className='text-center'>
          <Space>
            <Text type='secondary'>Chưa có tài khoản?</Text>
            <Button
              type='link'
              onClick={() => navigate(createRoute(ROUTES.REGISTER))}
              className='p-0 h-auto text-blue-500 hover:text-blue-700'
            >
              Đăng ký ngay
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  )
}

export default LoginForm
