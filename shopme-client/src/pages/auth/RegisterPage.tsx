import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  FormHelperText,
  Container,
  Divider,
} from '@mui/material'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { ROUTES } from '../../config/appConfig'
import customerService from '../../services/customerService'
import { CustomerRegister } from '../../types/customer'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import addressService from '../../services/addressService'
import { useAuth } from '../../contexts/AuthContext'
import { CustomerStatus } from '../../types/customer'

// Validation schema
const validationSchema = yup.object({
  firstName: yup.string().required('Họ là bắt buộc'),
  lastName: yup.string().required('Tên là bắt buộc'),
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, 'Số điện thoại chỉ bao gồm các chữ số')
    .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
    .required('Số điện thoại là bắt buộc'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
  addressLine1: yup.string().required('Địa chỉ là bắt buộc'),
  city: yup.string().required('Thành phố là bắt buộc'),
  state: yup.string().required('Tỉnh/Thành phố là bắt buộc'),
  countryId: yup.number().required('Quốc gia là bắt buộc'),
})

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { refreshCustomerData } = useAuth()
  const [loading, setLoading] = useState(false)
  const [countries, setCountries] = useState<
    { value: number; label: string }[]
  >([])

  // Load country list on component mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countriesData = await addressService.getCountriesFormSelect()
        setCountries(
          countriesData.map((country) => ({
            value: parseInt(country.key),
            label: country.value,
          }))
        )
      } catch (error) {
        console.error('Failed to load countries:', error)
      }
    }

    loadCountries()
  }, [])

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      addressLine1: '',
      city: '',
      state: '',
      countryId: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const { confirmPassword, ...registrationData } = values

        const response = await customerService.register(
          registrationData as CustomerRegister
        )

        if (response) {
          toast.success('Đăng ký thành công')
          const { token, customer } = response

          // Store token in localStorage
          localStorage.setItem('token', token)

          // Update auth context with customer data
          await refreshCustomerData()

          // Redirect based on customer status
          if (customer.status === CustomerStatus.NEED_INFO) {
            navigate(ROUTES.CUSTOMER_INFO)
          } else if (customer.status === CustomerStatus.UNVERIFIED) {
            navigate(ROUTES.EMAIL_VERIFICATION)
          } else {
            // Default - go to home page
            navigate(ROUTES.HOME)
          }
        } else {
          toast.error('Đăng ký thất bại, vui lòng thử lại.')
        }
      } catch (error) {
        console.error('Registration error:', error)
        toast.error('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    },
  })

  const handleLoginClick = () => {
    navigate(ROUTES.LOGIN)
  }

  return (
    <Container maxWidth='md'>
      <ToastContainer />
      <Box sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant='h4' align='center' gutterBottom>
            Đăng ký tài khoản
          </Typography>
          <Typography
            variant='body1'
            align='center'
            color='textSecondary'
            sx={{ mb: 4 }}
          >
            Tạo tài khoản để mua sắm dễ dàng hơn
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
                />
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id='password'
                  name='password'
                  label='Mật khẩu'
                  type='password'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
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

              {/* Address Information */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant='h6' sx={{ mb: 2, mt: 2 }}>
                  Thông tin địa chỉ
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id='addressLine1'
                  name='addressLine1'
                  label='Địa chỉ'
                  value={formik.values.addressLine1}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.addressLine1 &&
                    Boolean(formik.errors.addressLine1)
                  }
                  helperText={
                    formik.touched.addressLine1 && formik.errors.addressLine1
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id='city'
                  name='city'
                  label='Quận/Huyện'
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id='state'
                  name='state'
                  label='Tỉnh/Thành phố'
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={
                    formik.touched.countryId && Boolean(formik.errors.countryId)
                  }
                >
                  <InputLabel id='country-label'>Quốc gia</InputLabel>
                  <Select
                    labelId='country-label'
                    id='countryId'
                    name='countryId'
                    value={formik.values.countryId}
                    label='Quốc gia'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.value} value={country.value}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.countryId && formik.errors.countryId && (
                    <FormHelperText>{formik.errors.countryId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant='contained'
                  color='primary'
                  type='submit'
                  disabled={loading}
                  sx={{ mt: 2, height: '50px' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Đăng ký'}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant='body1'>
              Đã có tài khoản?{' '}
              <Button color='primary' onClick={handleLoginClick}>
                Đăng nhập
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default RegisterPage
