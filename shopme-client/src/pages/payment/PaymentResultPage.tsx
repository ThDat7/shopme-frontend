import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Result, Button } from 'antd'
import { ROUTES } from '../../config/appConfig'
import { useRoutes } from '../../hooks/useRoutes'

type PaymentStatus = 'success' | 'failed' | 'cancelled'

interface PaymentResultState {
  status: PaymentStatus
  orderCode: number
  message?: string
}

const PaymentResultPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { createRoute } = useRoutes()
  const { status, orderCode, message } = location.state as PaymentResultState

  const getResultProps = () => {
    switch (status) {
      case 'success':
        return {
          status: 'success' as const,
          title: 'Thanh toán thành công!',
          subTitle: `Đơn hàng #${orderCode} đã được thanh toán thành công.`,
        }
      case 'failed':
        return {
          status: 'error' as const,
          title: 'Thanh toán thất bại!',
          subTitle:
            message || `Đơn hàng #${orderCode} thanh toán không thành công.`,
        }
      case 'cancelled':
        return {
          status: 'info' as const,
          title: 'Đã hủy thanh toán',
          subTitle: `Đơn hàng #${orderCode} đã được hủy.`,
        }
      default:
        return {
          status: 'error' as const,
          title: 'Có lỗi xảy ra',
          subTitle: 'Không thể xác định trạng thái thanh toán.',
        }
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <Result
          {...getResultProps()}
          extra={[
            <Button
              type='primary'
              key='orders'
              onClick={() => navigate(createRoute(ROUTES.ORDERS))}
            >
              Xem đơn hàng
            </Button>,
            <Button key='shop' onClick={() => navigate(createRoute(ROUTES.HOME))}>
              Tiếp tục mua sắm
            </Button>,
          ]}
        />
      </div>
    </div>
  )
}

export default PaymentResultPage
