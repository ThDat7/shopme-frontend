import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material'
import { ROUTES } from '../../config/appConfig'
import customerService from '../../services/customerService'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '../../contexts/AuthContext'
import { CustomerStatus } from '../../types/customer'

const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate()
  const { customer, refreshCustomerData } = useAuth()
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    // Redirect if no customer data or customer is already verified
    if (!customer) {
      navigate(ROUTES.LOGIN)
    }
  }, [customer, navigate])

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verificationCode.trim()) {
      toast.error('Vui lòng nhập mã xác thực')
      return
    }

    if (!customer?.email) {
      toast.error('Không có thông tin email người dùng')
      return
    }

    setLoading(true)
    try {
      const response = await customerService.verifyEmail({
        email: customer.email,
        verificationCode,
      })

      if (response.verified) {
        toast.success('Xác thực email thành công')

        // Refresh customer data in context to get updated status
        await refreshCustomerData()

        // Kiểm tra trạng thái khách hàng sau khi làm mới dữ liệu
        const updatedCustomer = await customerService.getCurrentCustomer()

        setTimeout(() => {
          // Nếu khách hàng cần cập nhật thông tin thì chuyển hướng tới trang thông tin
          if (updatedCustomer.status === CustomerStatus.NEED_INFO) {
            navigate(ROUTES.PROFILE)
          } else {
            // Nếu không thì chuyển hướng về trang chủ
            navigate(ROUTES.HOME)
          }
        }, 2000)
      } else {
        toast.error('Xác thực không thành công. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Verification error:', error)
      toast.error('Đã xảy ra lỗi khi xác thực. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!customer?.email) {
      toast.error('Không có thông tin email người dùng')
      return
    }

    setResendLoading(true)
    try {
      await customerService.resendVerificationCode({ email: customer.email })

      toast.success('Mã xác thực đã được gửi đến email của bạn')
      setCountdown(60)
    } catch (error) {
      console.error('Resend error:', error)
      toast.error('Đã xảy ra lỗi khi gửi lại mã. Vui lòng thử lại sau.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <Container maxWidth='sm'>
      <ToastContainer />
      <Box sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant='h4' align='center' gutterBottom>
            Xác thực Email
          </Typography>
          <Typography
            variant='body1'
            align='center'
            color='textSecondary'
            sx={{ mb: 4 }}
          >
            Vui lòng nhập mã xác thực đã được gửi đến email {customer?.email}
          </Typography>

          <Alert severity='info' sx={{ mb: 3 }}>
            Chúng tôi đã gửi mã xác thực đến email của bạn. Vui lòng kiểm tra
            hộp thư đến và thư rác.
          </Alert>

          <form onSubmit={handleVerificationSubmit}>
            <TextField
              fullWidth
              label='Mã xác thực'
              variant='outlined'
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder='Nhập mã 6 chữ số'
              margin='normal'
              inputProps={{ maxLength: 6 }}
              autoFocus
            />

            <Button
              fullWidth
              variant='contained'
              color='primary'
              type='submit'
              disabled={loading}
              sx={{ mt: 3, mb: 2, height: '50px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Xác nhận'}
            </Button>
          </form>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant='text'
              color='primary'
              onClick={handleResendCode}
              disabled={resendLoading || countdown > 0}
            >
              {resendLoading ? (
                <CircularProgress size={20} />
              ) : countdown > 0 ? (
                `Gửi lại mã (${countdown}s)`
              ) : (
                'Gửi lại mã'
              )}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button color='primary' onClick={() => navigate(ROUTES.LOGIN)}>
              Quay lại đăng nhập
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default EmailVerificationPage
