// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
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
import LoginForm from './components/authentication/LoginForm'
import CartPage from './pages/cart/CartPage'
import CheckoutPage from './pages/checkout/CheckoutPage'

const App: React.FC = () => {
  return (
    // <AuthProvider>
    <ConfigProvider theme={theme}>
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path='categories' element={<CategoryPage />} />
            <Route path='categories/:id' element={<CategoryPage />} />
            <Route path='products' element={<ProductListPage />} />
            <Route path='products/:id' element={<ProductDetailPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/addresses' element={<AddressListPage />} />
            <Route path='/addresses/new' element={<AddressNewPage />} />
            <Route path='/addresses/edit/:id' element={<AddressEditPage />} />
            {/* Other routes will be added here */}
            <Route path='/login' element={<LoginForm />} />
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
    /* </AuthProvider> */
  )
}

export default App
