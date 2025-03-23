import { Box, Typography, Button, Alert } from '@mui/material'
import { useEffect, useState } from 'react'
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
import { toJpeg } from 'html-to-image'
import QRCode from 'antd/es/qr-code'
import { VietQRBank } from '../../types/payment'
import { ROUTES } from '../../config/appConfig'

const BankPayment = ({
  checkoutResponse,
  isCheckout,
  onCancel,
  toast,
}: {
  checkoutResponse: any
  isCheckout: boolean
  onCancel: () => void
  toast: any
}) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [openQR, setOpenQR] = useState(false)
  const [bank, setBank] = useState<VietQRBank | null>(null)

  const handleCopyText = (textToCopy: string) => {
    toast.success('Sao chép thành công')
    navigator.clipboard.writeText(textToCopy)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const downloadQRCode = async () => {
    var node = document.getElementById('my-node')

    if (!node) return

    toJpeg(node, { quality: 0.95 })
      .then(function (dataUrl) {
        // download(dataUrl, "my-node.png");
        const link = document.createElement('a')
        link.download = `${checkoutResponse.accountNumber}_${checkoutResponse.bin}_${checkoutResponse.amount}_${checkoutResponse.orderCode}_Qrcode.png`
        link.href = dataUrl
        link.click()
        link.remove()
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error)
      })
  }

  useEffect(() => {
    async function getListBank() {
      const res = await paymentService.getListBank()
      const bank = res.filter((bank) => bank.bin === checkoutResponse.bin)
      setBank(bank[0])
    }

    if (!checkoutResponse?.bin) return
    getListBank()
  }, [])


  return (
    <Box
      component={'div'}
      sx={{ flex: 3, borderWidth: 0.5, alignItems: 'center' }}
      className='!border-gray-200 !border-solid rounded-2xl shadow p-5 !bg-gradient-to-r from-purple-300 to-blue-400 flex flex-col !w-full'
    >
      <Alert severity='warning' className='mb-4'>
        <Typography className='!text-sm'>
          Lưu ý: Khi quét mã QR này, tiền sẽ được trừ trực tiếp từ tài khoản
          ngân hàng của bạn. Vui lòng kiểm tra kỹ thông tin trước khi thanh
          toán.
        </Typography>
      </Alert>
      <Typography className='!text-xl !font-bold text-gray-700 pb-5'>
        Thanh toán qua ngân hàng
      </Typography>
      <Box
        component={'div'}
        className='flex lg:flex-row w-full gap-10 md:flex-col sm:flex-row flex-col'
      >
        <Box
          component={'div'}
          className='flex flex-row self-center w-8/12 xl:w-4/12 2xl:w-3/12'
        >
          <Button className='w-full h-full' onClick={() => setOpenQR(true)}>
            <QRCode
              value={checkoutResponse.qrCode}
              level='M'
              includeMargin={true}
              // renderAs='svg'
              fgColor={'#25174E'}
              bgColor='transparent'
              style={{ borderRadius: 10, width: '100%', height: '100%' }}
              className='!bg-gradient-to-br from-green-200 via-purple-200 to-green-200'
            />
          </Button>
        </Box>
        <Box component={'div'} className='flex flex-col gap-5'>
          <Box component={'div'} className='flex flex-row gap-2'>
            <img src={bank?.logo} width={100} height={55} />
            <Box component={'div'} className='flex flex-col'>
              <Typography className='text-gray-900 text-opacity-70 !text-sm'>
                Ngân hàng
              </Typography>
              <Typography className='text-gray-800 !text-sm !font-bold'>
                {bank?.name}
              </Typography>
            </Box>
          </Box>
          <Box component={'div'} className='flex flex-col gap-2'>
            <Box component={'div'} className='flex flex-row'>
              <Box component={'div'} className='flex flex-col'>
                <Typography className='text-gray-900 text-opacity-70 !text-sm'>
                  Chủ tài khoản:
                </Typography>
                <Typography className='text-gray-800 !text-sm !font-bold'>
                  {checkoutResponse.accountName}
                </Typography>
              </Box>
            </Box>
            <Box component={'div'} className='flex flex-row'>
              <Box
                component={'div'}
                className='flex flex-col'
                sx={{ flex: 11 }}
              >
                <Typography className='text-gray-900 text-opacity-70 !text-sm'>
                  Số tài khoản :
                </Typography>
                <Typography className='text-gray-800 !text-sm !font-bold'>
                  {checkoutResponse.accountNumber}
                </Typography>
              </Box>
              <Button
                variant='contained'
                size='small'
                className='h-7 !bg-purple-200 !object-right !ml-auto !my-auto'
                sx={{ flex: 2 }}
                onClick={() => handleCopyText(checkoutResponse.accountNumber)}
              >
                <Typography className='!text-xs !font-bold text-gray-600 normal-case'>
                  Sao chép
                </Typography>
              </Button>
            </Box>
            <Box component={'div'} className='flex flex-row'>
              <Box
                component={'div'}
                className='flex flex-col'
                sx={{ flex: 11 }}
              >
                <Typography className='text-gray-900 text-opacity-70 !text-sm'>
                  Số tiền :
                </Typography>
                <Typography className='text-gray-800 !text-sm !font-bold'>
                  {checkoutResponse.amount} vnd
                </Typography>
              </Box>
              <Button
                variant='contained'
                size='small'
                className='h-7 !bg-purple-200 !object-right !ml-auto !my-auto'
                sx={{ flex: 2 }}
                onClick={() => handleCopyText(checkoutResponse.amount)}
              >
                <Typography className='!text-xs !font-bold text-gray-600 normal-case'>
                  Sao chép
                </Typography>
              </Button>
            </Box>
            <Box component={'div'} className='flex flex-row'>
              <Box
                component={'div'}
                className='flex flex-col'
                sx={{ flex: 11 }}
              >
                <Typography className='text-gray-900 text-opacity-70 !text-sm'>
                  Nội dung :
                </Typography>
                <Typography className='text-gray-800 !text-sm !font-bold '>
                  {checkoutResponse.description}
                </Typography>
              </Box>
              <Button
                variant='contained'
                size='small'
                sx={{ flex: 2 }}
                className='h-7 !bg-purple-200 !object-right !ml-auto !my-auto'
                onClick={() => handleCopyText(checkoutResponse.description)}
              >
                <Typography className='!text-xs !font-bold text-gray-600 normal-case'>
                  Sao chép
                </Typography>
              </Button>
            </Box>
          </Box>

          <Typography className='!text-sm text-gray-700'>
            Lưu ý : Nhập chính xác nội dung{' '}
            <span className='!font-bold'>{checkoutResponse.description}</span>{' '}
            khi chuyển khoản
          </Typography>
          <Box component={'div'} className='flex flex-row gap-5 items-center'>
            {!isCheckout && (
              <>
                <CircularProgress color='gray' width='30px' height='30px' />
                <Typography className='!text-lg text-gray-700'>
                  Đơn hàng đang chờ được thanh toán
                </Typography>
              </>
            )}
            {isCheckout && (
              <>
                <CheckIcon width={30} height={30} color='success' />
                <Typography className='!text-lg text-gray-700'>
                  Đơn hàng đã được thanh toán thành công
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>
      <Typography className='!text-sm text-gray-700 p-5'>
        Mở App Ngân hàng bất kỳ để quét mã VietQR hoặc chuyển khoản chính xác
        nội dung bên trên
      </Typography>
      <Box component={'div'} className='flex flex-row gap-5 mt-4'>
        <Button
          variant='contained'
          onClick={handleClickOpen}
          className='!bg-white h-10'
        >
          <Typography className={'normal-case !font-bold text-gray-700'}>
            Hủy thanh toán
          </Typography>
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title' className='self-center'>
          {'Huỷ bỏ đơn hàng'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id='alert-dialog-description'
            sx={{ color: 'text.primary' }}
          >
            Bạn có chắc muốn huỷ đơn hàng hay không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ bỏ</Button>
          <Button onClick={onCancel} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      {/*Dialog for Qr Code*/}
      <Dialog open={openQR} onClose={() => setOpenQR(false)}>
        <Box
          component={'div'}
          className='p-20 flex flex-col justify-center items-center gap-5'
        >
          <Typography className='text-center'>
            Mở App Ngân hàng bất kỳ để quét mã VietQR
          </Typography>
          <QRCode
            id='my-node'
            value={checkoutResponse.qrCode}
            level='M'
            includeMargin={true}
            fgColor={'#25174E'}
            bgColor='transparent'
            style={{ borderRadius: 10, width: '100%', height: '100%' }}
            className='!bg-gradient-to-br from-green-200 via-purple-200 to-green-200'
          />
          <Box component={'div'} className='flex flex-row gap-10 pt-10'>
            <Button
              variant='outlined'
              startIcon={<DownloadIcon />}
              color='inherit'
              onClick={downloadQRCode}
            >
              <Typography className='normal-case'>Tải xuống</Typography>
            </Button>
            <Button
              variant='outlined'
              color='inherit'
              startIcon={<ShareIcon />}
            >
              <Typography className='normal-case'>Chia sẻ</Typography>
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}

export default BankPayment
