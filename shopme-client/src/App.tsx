// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider, Spin } from 'antd'
import Layout from './components/layout/Layout'
import HomePage from './pages/home/HomePage'
import ProductDetailPage from './pages/product/ProductDetailPage'
import ProductListPage from './pages/product/ProductListPage'
import AddressListPage from './pages/address/AddressListPage'
import AddressNewPage from './pages/address/AddressNewPage'
import AddressEditPage from './pages/address/AddressEditPage'
import { ToastContainer } from 'react-toastify'
import theme from './theme/themeConfig'
import './App.css'
import './theme/buttonFix.css'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import EmailVerificationPage from './pages/auth/EmailVerificationPage'
import CustomerInfoPage from './pages/auth/CustomerInfoPage'
import CartPage from './pages/cart/CartPage'
import CheckoutPage from './pages/checkout/CheckoutPage'
import PaymentPage from './pages/payment/PaymentPage'
import PaymentResultPage from './pages/payment/PaymentResultPage'
import OrdersPage from './pages/order/OrdersPage'
import OrderDetailPage from './pages/order/OrderDetailPage'
import ScrollToTop from './components/layout/ScrollToTop'
import ProtectedRoute from './components/authentication/ProtectedRoute'
import { ROUTES } from './config/appConfig'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import NewsPage from './pages/news/NewsPage'
import PromotionsPage from './pages/promotions/PromotionsPage'
import SupportPage from './pages/support/SupportPage'
import { CartProvider } from './contexts/CartContext'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  )
}

// Tách component con để xử lý loading state
const AppContent: React.FC = () => {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <Spin size='large' tip='Đang tải...' />
      </div>
    )
  }

  return (
    <ConfigProvider theme={theme}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Main layout with header/footer */}
          <Route path='/' element={<Layout />}>
            {/* Authentication routes */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route
              path={ROUTES.EMAIL_VERIFICATION}
              element={<EmailVerificationPage />}
            />
            <Route path={ROUTES.PROFILE} element={<CustomerInfoPage />} />

            <Route index element={<HomePage />} />
            <Route path={ROUTES.PRODUCTS} element={<ProductListPage />} />
            <Route
              path={ROUTES.PRODUCT_DETAIL}
              element={<ProductDetailPage />}
            />
            <Route path={ROUTES.NEWS} element={<NewsPage />} />
            <Route path={ROUTES.PROMOTIONS} element={<PromotionsPage />} />
            <Route
              path={ROUTES.PROMOTION_DETAIL}
              element={<PromotionsPage />}
            />
            <Route path={ROUTES.SUPPORT} element={<SupportPage />} />
            <Route path={ROUTES.SUPPORT_GUIDE} element={<SupportPage />} />
            <Route
              path={ROUTES.SUPPORT_RETURN_POLICY}
              element={<SupportPage />}
            />
            <Route path={ROUTES.SUPPORT_WARRANTY} element={<SupportPage />} />
            <Route path={ROUTES.SUPPORT_CONTACT} element={<SupportPage />} />
            <Route path={ROUTES.SUPPORT_FAQ} element={<SupportPage />} />
            {/* <Route path={ROUTES.CATEGORY_DETAIL} element={<CategoryPage />} /> */}

            {/* Protected routes */}
            <Route
              path={ROUTES.CART}
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.CHECKOUT}
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ADDRESSES}
              element={
                <ProtectedRoute>
                  <AddressListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ADDRESS_NEW}
              element={
                <ProtectedRoute>
                  <AddressNewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ADDRESS_EDIT}
              element={
                <ProtectedRoute>
                  <AddressEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PAYMENT}
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PAYMENT_RESULT}
              element={
                <ProtectedRoute>
                  <PaymentResultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ORDERS}
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ORDER_DETAIL}
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </ConfigProvider>
  )
}

export default App
