import React from 'react'
import {
  Box,
  Typography,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Table,
  Paper,
  Divider,
  Chip,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import BankPayment from '../../components/payment/BankPayment'
import { useLocation, useNavigate } from 'react-router-dom'
import { CartItem } from '../../types/cart'
import orderService from '../../services/orderService'
import { ROUTES } from '../../config/appConfig'
import { OrderStatus } from '../../types/order'
import { useRoutes } from '../../hooks/useRoutes'
import { AddressDetail } from '../../types/address'
import { PaymentMethod } from '../../types/payment'

interface PaymentPageState {
  checkoutResponse: {
    orderId: number
    orderCode?: number
    checkoutUrl: string
    qrCode?: string
    bin?: string
    accountNumber?: string
    accountName?: string
    amount?: number
    description?: string
  }
  cartItems: CartItem[]
  totalAmount: number
  shippingCost: number
  paymentMethod: PaymentMethod
  address: AddressDetail
}

const PaymentPage: React.FC = () => {
  const [isCheckout, setIsCheckout] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { createRoute } = useRoutes()
  const state = location.state as PaymentPageState
  const { checkoutResponse, cartItems, totalAmount, shippingCost, address, paymentMethod } = state || {}
  
  const pollingInterval = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    // Kiểm tra xem có dữ liệu thanh toán không
    if (!checkoutResponse || !checkoutResponse.orderCode) {
      toast.error('Không tìm thấy thông tin thanh toán')
      setTimeout(() => {
        navigate(createRoute(ROUTES.CHECKOUT))
      }, 3000)
      return
    }

    // Bắt đầu kiểm tra trạng thái thanh toán
    pollingInterval.current = setInterval(async () => {
      try {
        const status = await orderService.getOrderStatus(checkoutResponse.orderCode as number)
        if (status === OrderStatus.PAID) {
          setIsCheckout(true)
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current)
          }
          navigate(createRoute(ROUTES.PAYMENT_RESULT), {
            state: {
              status: 'success',
              orderCode: checkoutResponse.orderCode,
            },
          })
        } else if (status === OrderStatus.CANCELLED) {
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current)
          }
          navigate(createRoute(ROUTES.PAYMENT_RESULT), {
            state: {
              status: 'cancelled',
              orderCode: checkoutResponse.orderCode,
            },
          })
        } else if (status === OrderStatus.REFUNDED) {
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current)
          }
          navigate(createRoute(ROUTES.PAYMENT_RESULT), {
            state: {
              status: 'failed',
              orderCode: checkoutResponse.orderCode,
              message: 'Thanh toán không thành công, vui lòng thử lại sau.',
            },
          })
        }
      } catch (error) {
        console.error('Failed to check payment status:', error)
      }
    }, 5000) // Kiểm tra mỗi 5 giây

    // Dừng kiểm tra khi component bị hủy
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
    }
  }, [checkoutResponse, navigate])

  const handleCancelPayment = async () => {
    try {
      if (!checkoutResponse || !checkoutResponse.orderCode) return
      
      await orderService.cancelOrder(checkoutResponse.orderCode as number)
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
      navigate(createRoute(ROUTES.PAYMENT_RESULT), {
        state: {
          status: 'cancelled',
          orderCode: checkoutResponse.orderCode,
        },
      })
    } catch (error) {
      console.error('Failed to cancel payment:', error)
      toast.error('Không thể hủy thanh toán, vui lòng thử lại sau.')
    }
  }

  if (!state || !checkoutResponse) {
    return (
      <Box className="container mx-auto py-8 px-4 text-center">
        <Typography variant="h5" className="mb-4">
          Không tìm thấy thông tin thanh toán
        </Typography>
        <Typography className="mb-4">
          Đang chuyển hướng trang thanh toán...
        </Typography>
        <ToastContainer />
      </Box>
    )
  }

  return (
    <Box className="container mx-auto py-8 px-4">
      <Typography variant="h4" className="mb-6 font-bold text-center">
        Thanh toán đơn hàng
      </Typography>
      
      <Box className="flex flex-col md:flex-row gap-6">
        {/* Thông tin đơn hàng */}
        <Box className="flex-1">
          <Paper elevation={2} className="p-4 rounded-lg mb-6">
            <Box className="flex justify-between items-center mb-4 pb-3 border-b">
              <Typography variant="h6" className="font-bold">
                Thông tin đơn hàng
              </Typography>
              <Chip 
                label={`Mã đơn hàng: #${checkoutResponse.orderCode || checkoutResponse.orderId}`} 
                color="primary" 
                variant="outlined"
              />
            </Box>
            
            <Box className="mb-4">
              <Typography variant="subtitle1" className="font-bold mb-2">
                Sản phẩm
              </Typography>
              <TableContainer component={Paper} variant="outlined" className="mb-4">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell align="right">Giá</TableCell>
                      <TableCell align="right">SL</TableCell>
                      <TableCell align="right">Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item: CartItem, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">{item.discountPrice}₫</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{(item.discountPrice * item.quantity)}₫</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} />
                      <TableCell align="right">
                        <Typography variant="subtitle2">Tạm tính:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">
                          {(totalAmount - shippingCost)}₫
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} />
                      <TableCell align="right">
                        <Typography variant="subtitle2">Phí vận chuyển:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">
                          {shippingCost}₫
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} />
                      <TableCell align="right">
                        <Typography variant="subtitle1" className="font-bold">
                          Tổng cộng:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" className="font-bold text-red-600">
                          {totalAmount}₫
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            
            <Divider className="my-4" />
            
            <Box className="mb-4">
              <Typography variant="subtitle1" className="font-bold mb-2">
                Địa chỉ giao hàng
              </Typography>
              <Paper variant="outlined" className="p-3">
                <Typography variant="body1" className="font-bold">
                  {`${address.firstName} ${address.lastName}`}
                </Typography>
                <Typography variant="body2">
                  {address.phoneNumber}
                </Typography>
                <Typography variant="body2">
                  {address.addressLine}
                </Typography>
                <Typography variant="body2">
                  {`${address.wardId || ''} ${address.districtId ? ', ' + address.districtId : ''} ${address.provinceId ? ', ' + address.provinceId : ''}`}
                </Typography>
              </Paper>
            </Box>
            
            <Divider className="my-4" />
            
            <Box>
              <Typography variant="subtitle1" className="font-bold mb-2">
                Phương thức thanh toán
              </Typography>
              <Chip 
                label={paymentMethod === 'PAY_OS' ? 'Thanh toán qua ngân hàng' : paymentMethod} 
                color="primary" 
                className="mb-2"
              />
            </Box>
          </Paper>
        </Box>
        
        {/* Thanh toán */}
        <Box className="flex-1">
          <ToastContainer position="top-right" autoClose={3000} />
          {checkoutResponse.qrCode ? (
            <BankPayment
              checkoutResponse={{
                ...checkoutResponse,
                amount: totalAmount
              }}
              isCheckout={isCheckout}
              onCancel={handleCancelPayment}
              toast={toast}
            />
          ) : (
            <Paper elevation={3} className="p-6 rounded-lg text-center">
              <Typography variant="h6" className="mb-4">
                Đang chờ thông tin thanh toán...
              </Typography>
              <Typography>
                Vui lòng chờ trong giây lát hoặc liên hệ với chúng tôi để được hỗ trợ.
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default PaymentPage
