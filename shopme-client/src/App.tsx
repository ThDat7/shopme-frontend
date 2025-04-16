// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider, Spin } from 'antd'
import Layout from './components/layout/Layout'
import HomePage from './pages/home/HomePage'
import CategoryPage from './pages/category/CategoryPage'
import ProductDetailPage from './pages/product/ProductDetailPage'
import ProductListPage from './pages/product/ProductListPage'
import AddressListPage from './pages/address/AddressListPage'
import AddressNewPage from './pages/address/AddressNewPage'
import AddressEditPage from './pages/address/AddressEditPage'
import { ToastContainer } from 'react-toastify'
import theme from './theme/themeConfig'
import './App.css'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
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
import PromotionsPage from './pages/promotions/PromotionsPage'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
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
            <Route index element={<HomePage />} />
              <Route path={ROUTES.PROMOTIONS} element={<PromotionsPage />} />
              <Route
                  path={ROUTES.PROMOTION_DETAIL}
                  element={<PromotionsPage />}
              />
            <Route path='categories' element={<CategoryPage />} />
            <Route path='categories/:id' element={<CategoryPage />} />
            <Route path='products' element={<ProductListPage />} />
            <Route path='products/:id' element={<ProductDetailPage />} />

            {/* Protected routes */}
            <Route
              path='/cart'
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/checkout'
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/addresses'
              element={
                <ProtectedRoute>
                  <AddressListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/addresses/new'
              element={
                <ProtectedRoute>
                  <AddressNewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/addresses/edit/:id'
              element={
                <ProtectedRoute>
                  <AddressEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/payment'
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/payment/result'
              element={
                <ProtectedRoute>
                  <PaymentResultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/orders'
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/orders/:id'
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
