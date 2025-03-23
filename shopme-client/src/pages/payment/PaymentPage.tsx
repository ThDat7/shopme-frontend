import {
  Box,
  Typography,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Table,
} from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
// import PaymentMethod from '../components/PaymentMethod'
import BankPayment from '../../components/payment/BankPayment'
import { useLocation, useNavigate } from 'react-router-dom'
import { CartItem } from '../../types/cart'
import orderService from '../../services/orderService'
import { ROUTES } from '../../config/appConfig'
import { OrderStatus } from '../../types/order'

const Payment = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isCheckout, setIsCheckout] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { checkoutResponse, cartItems } = location.state
  const pollingInterval = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  )

  useEffect(() => {
    if (!checkoutResponse || !checkoutResponse.orderCode) {
      return
    }

    // Start polling payment status
    pollingInterval.current = setInterval(async () => {
      try {
        const status = await orderService.getOrderStatus(
          checkoutResponse.orderCode
        )
        if (status === OrderStatus.PAID) {
          setIsCheckout(true)
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current)
          }
          navigate(ROUTES.PAYMENT_RESULT, {
            state: {
              status: 'success',
              orderCode: checkoutResponse.orderCode,
            },
          })
        } else if (status === OrderStatus.CANCELLED) {
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current)
          }
          navigate(ROUTES.PAYMENT_RESULT, {
            state: {
              status: 'cancelled',
              orderCode: checkoutResponse.orderCode,
            },
          })
        } else if (status === OrderStatus.REFUNDED) {
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current)
          }
          navigate(ROUTES.PAYMENT_RESULT, {
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
    }, 5000) // Check every 5 seconds

    // Cleanup polling on unmount
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
    }
  }, [checkoutResponse, navigate])

  const handleCancelPayment = async () => {
    try {
      await orderService.cancelOrder(checkoutResponse.orderCode)
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
      navigate(ROUTES.PAYMENT_RESULT, {
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

  if (!checkoutResponse || !checkoutResponse.qrCode) {
    return <Typography>Something went wrong!</Typography>
  }

  return (
    <>
      <Box
        component={'div'}
        className='!flex md:flex-row flex-col !flex-1 !m-10 gap-10'
      >
        <ToastContainer />

        <Box
          component={'div'}
          sx={{ flex: 2, borderWidth: 1 }}
          className='!border-gray-200 !border-solid rounded-2xl flex !flex-col shadow'
        >
          <Box
            component={'div'}
            sx={{ borderBottomStyle: 'dashed' }}
            className=' w-full !h-20 border-gray-200 border-b'
          >
            <Typography className='!font-bold !text-2xl p-5'>
              Thông tin đơn hàng
            </Typography>
          </Box>
          <Box
            component={'div'}
            className='w-full p-5 flex flex-col gap-5 border-gray-200 border-b'
            sx={{ borderBottomStyle: 'dashed' }}
          >
            <Typography className='!font-bold !text-xl'>
              {`Mã đơn hàng: #${checkoutResponse.orderCode}`}
            </Typography>
            <TableContainer>
              <Table aria-label='simple table' size='small' className='w-full'>
                <TableHead>
                  <TableRow>
                    <TableCell align='center' className='!font-bold'>
                      STT
                    </TableCell>
                    <TableCell align='center' className='!font-bold'>
                      Tên
                    </TableCell>
                    <TableCell align='center' className='!font-bold'>
                      Giá trị
                    </TableCell>
                    <TableCell align='center' className='!font-bold'>
                      Số lượng
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item: CartItem, index: number) => (
                    // re-handle it to full info
                    <TableRow key={index}>
                      <TableCell align='center'>{index + 1}</TableCell>
                      <TableCell align='center'>{item.name}</TableCell>
                      <TableCell align='center'>{item.price}</TableCell>
                      <TableCell align='center'>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography className='!font-bold !ml-auto'>
              {`Tổng tiền: ${checkoutResponse.amount.toLocaleString()}đ`}
            </Typography>
          </Box>
          <Box
            component={'div'}
            className='w-full p-5 flex flex-col gap-5 border-gray-200 border-b'
            sx={{ borderBottomStyle: 'dashed' }}
          ></Box>
        </Box>
        {selectedIndex === 0 && (
          <BankPayment
            checkoutResponse={checkoutResponse}
            isCheckout={isCheckout}
            onCancel={handleCancelPayment}
            toast={toast}
          />
        )}
      </Box>
    </>
  )
}
export default Payment
