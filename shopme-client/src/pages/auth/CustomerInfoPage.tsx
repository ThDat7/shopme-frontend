import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Container,
  IconButton,
  Collapse,
} from '@mui/material'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { ROUTES } from '../../config/appConfig'
import customerService from '../../services/customerService'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '../../contexts/AuthContext'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

// Create two validation schemas - one for database users and one for Google users
const createValidationSchema = (isDatabaseUser: boolean) => {
  // Base schema for all fields except email and password
  const baseSchema = {
    firstName: yup.string().required('Họ là bắt buộc'),
    lastName: yup.string().required('Tên là bắt buộc'),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]+$/, 'Số điện thoại chỉ bao gồm các chữ số')
      .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
      .required('Số điện thoại là bắt buộc'),
  }

  // Add email validation only if authenticationType is 'DATABASE'
  if (isDatabaseUser) {
    return yup.object({
      ...baseSchema,
      email: yup
        .string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),
      password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
    })
  }

  // For Google authentication, no validation for email as it's not editable
  return yup.object(baseSchema)
}

const CustomerInfoPage: React.FC = () => {
  const navigate = useNavigate()
  const { customer, refreshCustomerData } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPasswordFields, setShowPasswordFields] = useState(false)

  // Check if user is database user (affects email editability and password fields)
  const isDatabaseUser = customer?.authenticationType === 'DATABASE'

  // Create the appropriate validation schema
  const validationSchema = createValidationSchema(isDatabaseUser)

  const formik = useFormik({
    initialValues: {
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.email || '',
      phoneNumber: customer?.phoneNumber || '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    enableReinitialize: true, // Important for when customer data is loaded asynchronously
    onSubmit: async (values) => {
      setLoading(true)
      try {
        // Only include relevant fields based on authentication type
        let updateData = { ...values }

        if (!isDatabaseUser) {
          // For Google users, exclude email and password fields
          updateData = {
            ...values,
            email: '',
            password: '',
            confirmPassword: '',
          }
        } else if (!values.password) {
          updateData = {
            ...values,
            password: '',
            confirmPassword: '',
          }
        } else {
          updateData = {
            ...values,
            password: values.password,
            confirmPassword: '',
          }
        }

        const response = await customerService.updateCustomerInfo(updateData)

        if (response) {
          toast.success('Cập nhật thông tin thành công')

          await refreshCustomerData()

          setTimeout(() => {
            navigate(ROUTES.HOME)
          }, 2000)
        } else {
          toast.error('Cập nhật thông tin thất bại, vui lòng thử lại.')
        }
      } catch (error) {
        console.error('Update error:', error)
        toast.error(
          'Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau.'
        )
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <Container maxWidth='md'>
      <ToastContainer />
      <Box sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant='h4' align='center' gutterBottom>
            Bổ sung thông tin tài khoản
          </Typography>
          <Typography
            variant='body1'
            align='center'
            color='textSecondary'
            sx={{ mb: 4 }}
          >
            Để tiếp tục sử dụng dịch vụ, vui lòng bổ sung thông tin cá nhân của
            bạn
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Thông tin cá nhân
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id='firstName'
                  name='firstName'
                  label='Họ'
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id='lastName'
                  name='lastName'
                  label='Tên'
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id='email'
                  name='email'
                  label='Email'
                  type='email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  disabled={!isDatabaseUser}
                  InputProps={{
                    readOnly: !isDatabaseUser,
                  }}
                />
                {!isDatabaseUser && (
                  <Typography variant='caption' color='textSecondary'>
                    Email không thể thay đổi khi đăng nhập bằng Google
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id='phoneNumber'
                  name='phoneNumber'
                  label='Số điện thoại'
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.phoneNumber &&
                    Boolean(formik.errors.phoneNumber)
                  }
                  helperText={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                />
              </Grid>

              {/* Password Section - Only for Database Users */}
              {isDatabaseUser && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      mb: 1,
                    }}
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                  >
                    <Typography variant='subtitle1'>
                      Thay đổi mật khẩu
                    </Typography>
                    <IconButton size='small'>
                      {showPasswordFields ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </Box>

                  <Collapse in={showPasswordFields}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id='password'
                          name='password'
                          label='Mật khẩu mới'
                          type='password'
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.password &&
                            Boolean(formik.errors.password)
                          }
                          helperText={
                            formik.touched.password && formik.errors.password
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id='confirmPassword'
                          name='confirmPassword'
                          label='Xác nhận mật khẩu'
                          type='password'
                          value={formik.values.confirmPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.confirmPassword &&
                            Boolean(formik.errors.confirmPassword)
                          }
                          helperText={
                            formik.touched.confirmPassword &&
                            formik.errors.confirmPassword
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='caption' color='textSecondary'>
                          Để trống nếu bạn không muốn thay đổi mật khẩu
                        </Typography>
                      </Grid>
                    </Grid>
                  </Collapse>
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant='contained'
                  color='primary'
                  type='submit'
                  disabled={loading}
                  sx={{ mt: 2, height: '50px' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Lưu thông tin'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}

export default CustomerInfoPage
