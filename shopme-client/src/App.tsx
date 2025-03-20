// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import Layout from './components/layout/Layout'
import HomePage from './pages/home/HomePage'
import CategoryPage from './pages/category/CategoryPage'
import ProductDetailPage from './pages/product/ProductDetailPage'
import ProductListPage from './pages/product/ProductListPage'
import { ToastContainer } from 'react-toastify'
import theme from './theme/themeConfig'
import './App.css'
import LoginForm from './components/authentication/LoginForm'
import CartPage from './pages/cart/CartPage'

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
