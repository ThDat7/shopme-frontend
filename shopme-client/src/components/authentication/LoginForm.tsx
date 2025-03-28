import React, { useState } from 'react'
import { Form, Input, Button, Divider, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { CustomerLoginRequest } from '../../types/auth'
import GoogleLoginComponent from './GoogleLoginComponent'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../config/appConfig'
import { useAuth } from '../../contexts/AuthContext'
import { CustomerStatus } from '../../types/customer'

const LoginForm: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
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
        navigate(ROUTES.CUSTOMER_INFO)
      } else if (customer.status === CustomerStatus.UNVERIFIED) {
        navigate(ROUTES.EMAIL_VERIFICATION)
      } else {
        navigate(ROUTES.HOME)
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
        navigate(ROUTES.CUSTOMER_INFO)
      } else if (customer.status === CustomerStatus.UNVERIFIED) {
        navigate(ROUTES.EMAIL_VERIFICATION)
      } else {
        navigate(ROUTES.HOME)
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
    <div className='max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-center mb-6'>Đăng nhập ShopMe</h2>
      <Form
        form={form}
        name='login'
        onFinish={onFinish}
        layout='vertical'
        requiredMark={false}
      >
        <Form.Item
          name='email'
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Vui lòng nhập email hợp lệ!' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder='Email' size='large' />
        </Form.Item>

        <Form.Item
          name='password'
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder='Mật khẩu'
            size='large'
          />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            block
            size='large'
            loading={loading}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <Divider>Hoặc</Divider>

      <div className='flex justify-center'>
        <GoogleLoginComponent onLoginSuccess={handleGoogleLoginSuccess} />
      </div>

      <div className='mt-4 text-center'>
        <Button
          type='link'
          onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
          className='text-blue-600 hover:text-blue-800'
        >
          Quên mật khẩu?
        </Button>
      </div>

      <div className='mt-4 text-center'>
        Chưa có tài khoản?{' '}
        <Button
          type='link'
          onClick={() => navigate(ROUTES.REGISTER)}
          className='text-blue-600 hover:text-blue-800'
        >
          Đăng ký ngay
        </Button>
      </div>
    </div>
  )
}

export default LoginForm
