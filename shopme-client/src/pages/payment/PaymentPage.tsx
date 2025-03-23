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
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import BankPayment from '../../components/payment/BankPayment'
import { useLocation, useNavigate } from 'react-router-dom'
import { CartItem } from '../../types/cart'
import { ROUTES } from '../../config/appConfig'

const Payment = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isCheckout, setIsCheckout] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { checkoutResponse, cartItems } = location.state

  useEffect(() => {
    if (!checkoutResponse || !checkoutResponse.orderCode) {
      return
    }

    // Cleanup polling on unmount
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
    }
  }, [checkoutResponse, navigate])

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
            toast={toast}
          />
        )}
      </Box>
    </>
  )
}
export default Payment
