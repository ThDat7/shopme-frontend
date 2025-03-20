import React from 'react'
import { Form, Input, Button, Divider, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { LoginRequest } from '../../types/auth'
import GoogleLoginComponent from './GoogleLoginComponent'
import authService from '../../services/authService'
import { useNavigate } from 'react-router-dom'

const LoginForm: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onFinish = async (values: LoginRequest) => {
    try {
      const response = await authService.login(values)
      authService.setToken(response.token)
      message.success('Login successful')
      navigate('/')
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('Failed to login')
      }
    }
  }

  const handleGoogleLoginSuccess = async (credential: string) => {
    try {
      const response = await authService.loginWithGoogle({ token: credential })
      authService.setToken(response.token)
      message.success('Login successful')
      navigate('/')
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('Failed to login with Google')
      }
    }
  }

  return (
    <div className='max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-center mb-6'>Login to ShopMe</h2>
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
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder='Email' size='large' />
        </Form.Item>

        <Form.Item
          name='password'
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder='Password'
            size='large'
          />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' block size='large'>
            Log in
          </Button>
        </Form.Item>
      </Form>

      <Divider>Or</Divider>

      <div className='flex justify-center'>
        <GoogleLoginComponent onLoginSuccess={handleGoogleLoginSuccess} />
      </div>

      <div className='mt-4 text-center'>
        <a
          href='/forgot-password'
          className='text-blue-600 hover:text-blue-800'
        >
          Forgot password?
        </a>
      </div>

      <div className='mt-4 text-center'>
        Don't have an account?{' '}
        <a href='/register' className='text-blue-600 hover:text-blue-800'>
          Register now
        </a>
      </div>
    </div>
  )
}

export default LoginForm
