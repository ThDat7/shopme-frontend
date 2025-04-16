import React, { useEffect, useState, useRef } from 'react'
import { Box, Typography, Button, Alert, Paper, Grid, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import paymentService from '../../services/paymentService'
import orderService from '../../services/orderService'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { CircularProgress } from 'react-cssfx-loading'
import CheckIcon from '@mui/icons-material/Check'
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CancelIcon from '@mui/icons-material/Cancel'
import { toJpeg } from 'html-to-image'
import QRCode from 'antd/es/qr-code'
import { VietQRBank } from '../../types/payment'
import { ROUTES } from '../../config/appConfig'

interface BankPaymentProps {
  checkoutResponse: {
    orderId?: number
    orderCode?: number
    checkoutUrl?: string
    qrCode?: string
    bin?: string
    accountNumber?: string
    accountName?: string
    amount?: number
    description?: string
  }
  isCheckout: boolean
  onCancel: () => void
  toast: any
}

const BankPayment: React.FC<BankPaymentProps> = ({
  checkoutResponse,
  // isCheckout,
  onCancel,
  toast,
}) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [openQR, setOpenQR] = useState(false)
  const [bank, setBank] = useState<VietQRBank | null>(null)
  const [isConfirmBypass, setIsConfirmBypass] = useState(false)
  const [countdown, setCountdown] = useState(900) // 15 phút = 900 giây
  const qrRef = useRef<HTMLDivElement>(null)
  // const isDevelopment = process.env.NODE_ENV === 'development'
  const isDevelopment = true

  useEffect(() => {
    // Đếm ngược thời gian hết hạn QR
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleCopyText = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy)
    toast.success('Đã sao chép vào clipboard')
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const downloadQRCode = async () => {
    if (!qrRef.current) return

    try {
      const dataUrl = await toJpeg(qrRef.current, { quality: 0.95 })
      const link = document.createElement('a')
      link.download = `QR_ThanhToan_${checkoutResponse.orderCode || checkoutResponse.orderId || 'order'}.png`
      link.href = dataUrl
      link.click()
      toast.success('Đã tải mã QR thành công')
    } catch (error) {
      console.error('Lỗi khi tải mã QR:', error)
      toast.error('Không thể tải mã QR, vui lòng thử lại')
    }
  }

  useEffect(() => {
    async function getListBank() {
      try {
        const res = await paymentService.getListBank()
        if (checkoutResponse?.bin) {
          const bankFound = res.filter((b) => b.bin === checkoutResponse.bin)
          if (bankFound.length > 0) {
            setBank(bankFound[0])
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách ngân hàng:', error)
      }
    }

    if (checkoutResponse?.bin) {
      getListBank()
    }
  }, [checkoutResponse])

  const handleBypassPayment = async () => {
    try {
      if (!checkoutResponse.orderCode) return
      
      await orderService.bypassPayment(checkoutResponse.orderCode)
      toast.success('Bypass payment thành công')
      setIsConfirmBypass(false)
      // Chuyển hướng đến trang thành công
      navigate(ROUTES.PAYMENT_RESULT, {
        state: {
          status: 'success',
          orderCode: checkoutResponse.orderCode,
        },
      })
    } catch (error) {
      console.error('Lỗi khi bypass payment:', error)
      toast.error('Không thể bypass payment, vui lòng thử lại sau.')
    }
  }

  return (
    <Paper elevation={3} className="p-6 rounded-lg">
      <Alert severity="warning" className="mb-4" variant="outlined">
        <Typography variant="body2">
          Lưu ý: Khi quét mã QR này, tiền sẽ được trừ trực tiếp từ tài khoản
          ngân hàng của bạn. Vui lòng kiểm tra kỹ thông tin trước khi thanh
          toán.
        </Typography>
      </Alert>
      
      <Typography variant="h6" className="font-bold mb-4">
        Thanh toán qua ngân hàng
      </Typography>
      
      <Box className="mb-2 text-center">
        <Typography variant="subtitle2" color="error" className="mb-2">
          Mã QR sẽ hết hạn sau: <strong>{formatTime(countdown)}</strong>
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* QR Code */}
        <Grid item xs={12} md={5} className="flex flex-col items-center">
          <Paper 
            elevation={1} 
            className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-3"
            ref={qrRef}
            id="my-node"
          >
            <Typography variant="h6" className="mb-2 text-center">
              Quét mã QR để thanh toán
            </Typography>
            
            <Box className="relative">
              <Alert severity="info" className="mb-3">
                Mã QR có hiệu lực trong {formatTime(countdown)}
              </Alert>
              
              <div className="flex flex-col items-center p-2 bg-white rounded-md">
                {checkoutResponse.qrCode ? (
                  <QRCode
                    value={checkoutResponse.qrCode}
                    level="M"
                    size={200}
                    bordered={false}
                  />
                ) : (
                  <Box className="w-[200px] h-[200px] flex items-center justify-center">
                    <CircularProgress color="#4f46e5" width="40px" height="40px" />
                  </Box>
                )}
                
                <Typography variant="caption" className="block text-center mt-2">
                  Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                </Typography>
              </div>
            </Box>
            
            <Box className="flex gap-2 justify-center mt-3">
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<DownloadIcon />}
                onClick={downloadQRCode}
              >
                Tải QR
              </Button>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<ShareIcon />}
                onClick={() => setOpenQR(true)}
              >
                Phóng to
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Thông tin chuyển khoản */}
        <Grid item xs={12} md={7}>
          <Paper elevation={1} className="p-4 rounded-lg">
            {bank && (
              <Box className="flex items-center mb-4">
                <img 
                  src={bank.logo} 
                  alt={bank.name} 
                  className="w-12 h-12 object-contain mr-3" 
                />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Ngân hàng
                  </Typography>
                  <Typography variant="subtitle1" className="font-bold">
                    {bank.name}
                  </Typography>
                </Box>
              </Box>
            )}
            
            <Divider className="my-3" />
            
            <Box className="space-y-3">
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Chủ tài khoản
                </Typography>
                <Typography variant="subtitle1" className="font-bold">
                  {checkoutResponse.accountName || 'Đang tải...'}
                </Typography>
              </Box>
              
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Số tài khoản
                  </Typography>
                  <Typography variant="subtitle1" className="font-bold">
                    {checkoutResponse.accountNumber || 'Đang tải...'}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => handleCopyText(checkoutResponse.accountNumber || '')}
                  disabled={!checkoutResponse.accountNumber}
                >
                  Sao chép
                </Button>
              </Box>
              
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Số tiền
                  </Typography>
                  <Typography variant="subtitle1" className="font-bold text-red-600">
                    {checkoutResponse.amount?.toLocaleString('vi-VN') || 0}₫
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => handleCopyText(checkoutResponse.amount?.toString() || '')}
                  disabled={!checkoutResponse.amount}
                >
                  Sao chép
                </Button>
              </Box>
              
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Nội dung chuyển khoản
                </Typography>
                <Typography variant="subtitle1" className="font-bold">
                  {checkoutResponse.description || `Thanh toan don hang #${checkoutResponse.orderCode || checkoutResponse.orderId}`}
                </Typography>
              </Box>
            </Box>
          </Paper>
          
          <Box className="mt-4 flex justify-between gap-2">
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleClickOpen}
              startIcon={<CancelIcon />}
            >
              Hủy thanh toán
            </Button>
            
            {isDevelopment && (
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => setIsConfirmBypass(true)}
                startIcon={<CheckIcon />}
              >
                Bypass (Dev)
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
      
      {/* Dialog xác nhận hủy */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Xác nhận hủy thanh toán
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn hủy thanh toán này? Đơn hàng của bạn sẽ bị hủy.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Không
          </Button>
          <Button onClick={onCancel} color="error" autoFocus>
            Hủy thanh toán
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog xác nhận bypass */}
      <Dialog
        open={isConfirmBypass}
        onClose={() => setIsConfirmBypass(false)}
        aria-labelledby="bypass-dialog-title"
        aria-describedby="bypass-dialog-description"
      >
        <DialogTitle id="bypass-dialog-title">
          Xác nhận bypass thanh toán
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="bypass-dialog-description">
            Chức năng này chỉ dành cho môi trường phát triển. Bạn có chắc chắn muốn bypass thanh toán này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmBypass(false)} color="primary">
            Không
          </Button>
          <Button onClick={handleBypassPayment} color="success" autoFocus>
            Bypass
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog phóng to QR */}
      <Dialog
        open={openQR}
        onClose={() => setOpenQR(false)}
        aria-labelledby="qr-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="qr-dialog-title" className="text-center">
          Mã QR thanh toán
        </DialogTitle>
        <DialogContent>
          <Box className="flex flex-col items-center">
            {checkoutResponse.qrCode ? (
              <QRCode
                value={checkoutResponse.qrCode}
                level="M"
                size={300}
                style={{ margin: '0 auto' }}
                bordered={false}
              />
            ) : (
              <Box className="w-[300px] h-[300px] flex items-center justify-center">
                <CircularProgress color="#4f46e5" width="50px" height="50px" />
              </Box>
            )}
            
            <Typography variant="body2" className="mt-4 text-center">
              Quét mã QR này bằng ứng dụng ngân hàng để thanh toán số tiền{' '}
              <strong>{checkoutResponse.amount?.toLocaleString('vi-VN')}₫</strong>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQR(false)} color="primary">
            Đóng
          </Button>
          <Button onClick={downloadQRCode} color="primary" startIcon={<DownloadIcon />}>
            Tải xuống
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default BankPayment
