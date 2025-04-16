import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
import {
  LockOutlined,
  KeyOutlined,
  ArrowLeftOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { ROUTES } from '../../config/appConfig'
import customerService from '../../services/customerService'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const { Title, Text } = Typography

interface LocationState {
  email?: string
}

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)
  const [email, setEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const state = location.state as LocationState
    if (state?.email) {
      setEmail(state.email)
      form.setFieldsValue({ email: state.email })
    }
  }, [location, form])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerifyCode = async () => {
    const code = form.getFieldValue('resetCode')
    if (!code) {
      toast.error('Vui lòng nhập mã xác nhận')
      return
    }

    setVerifyLoading(true)
    try {
      const result = await customerService.verifyResetCode({
        email: email || form.getFieldValue('email'),
        resetCode: code,
      })

      if (result.verified) {
        setResetCode(code)
        setCodeVerified(true)
        toast.success('Mã xác nhận hợp lệ')
      } else {
        toast.error('Mã xác nhận không hợp lệ')
      }
    } catch (error) {
      console.error('Verify code error:', error)
      toast.error('Đã xảy ra lỗi khi xác thực mã')
    } finally {
      setVerifyLoading(false)
    }
  }

  const handleResendCode = async () => {
    const emailValue = email || form.getFieldValue('email')
    if (!emailValue) {
      toast.error('Vui lòng nhập email')
      return
    }

    setLoading(true)
    try {
      await customerService.forgotPassword({ email: emailValue })
      toast.success('Mã xác nhận mới đã được gửi đến email của bạn')
      setCountdown(60)
    } catch (error) {
      console.error('Resend code error:', error)
      toast.error('Đã xảy ra lỗi khi gửi lại mã')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (values: {
    newPassword: string
    confirmPassword: string
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    setLoading(true)
    try {
      await customerService.resetPassword({
        email: email || form.getFieldValue('email'),
        resetCode,
        newPassword: values.newPassword,
      })

      toast.success('Đặt lại mật khẩu thành công')
      
      // Chuyển hướng về trang đăng nhập sau 2 giây
      setTimeout(() => {
        navigate(ROUTES.LOGIN)
      }, 2000)
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Đã xảy ra lỗi khi đặt lại mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <Card className="max-w-md w-full shadow-lg rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <Title level={2} className="mb-2">Đặt lại mật khẩu</Title>
            <Text type="secondary">
              {codeVerified
                ? 'Tạo mật khẩu mới cho tài khoản của bạn'
                : 'Nhập mã xác nhận đã được gửi đến email của bạn'}
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={codeVerified ? handleResetPassword : undefined}
            requiredMark={false}
            size="large"
          >
            {!email && (
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input
                  disabled={codeVerified}
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Email"
                  className="rounded-lg py-2"
                />
              </Form.Item>
            )}

            {!codeVerified ? (
              <>
                <Form.Item
                  name="resetCode"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mã xác nhận!' },
                  ]}
                >
                  <Input
                    prefix={<KeyOutlined className="text-gray-400" />}
                    placeholder="Mã xác nhận"
                    className="rounded-lg py-2"
                    maxLength={6}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    block
                    onClick={handleVerifyCode}
                    loading={verifyLoading}
                    className="h-12 rounded-lg font-medium"
                  >
                    Xác nhận mã
                  </Button>
                </Form.Item>

                <div className="text-center mb-4">
                  <Button
                    type="link"
                    onClick={handleResendCode}
                    disabled={countdown > 0}
                    className="p-0 h-auto text-blue-500 hover:text-blue-700"
                  >
                    {countdown > 0
                      ? `Gửi lại mã (${countdown}s)`
                      : 'Gửi lại mã'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Alert
                  message="Mã xác nhận hợp lệ"
                  description="Vui lòng tạo mật khẩu mới cho tài khoản của bạn."
                  type="success"
                  showIcon
                  className="mb-6"
                />

                <Form.Item
                  name="newPassword"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Mật khẩu mới"
                    className="rounded-lg py-2"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng xác nhận mật khẩu mới!',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          new Error('Mật khẩu xác nhận không khớp!')
                        )
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Xác nhận mật khẩu mới"
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
                    Đặt lại mật khẩu
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>

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

export default ResetPasswordPage