// src/App.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import { ProtectedRoute } from './ProtectedRoute'
import UserRoutes from './UserRoutes'
import CategoryRoutes from './CategoryRoutes'
import ProfilePage from '../pages/profile/ProfilePage'
import BrandRoutes from './BrandRoutes'
import ProductRoutes from './ProductRoutes'
import SettingRoutes from './SettingRoutes'
import LocationRoutes from './locationRoutes'
import ShippingRoutes from './ShippingRoutes'
import OrderRoutes from './orderRoutes'
import UnauthorizedPage from '../pages/unauthorized/UnauthorizedPage'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/login' element={<LoginPage />} />
      <Route path='/unauthorized' element={<UnauthorizedPage />} />

      {/* Protected Routes - Tất cả routes cần xác thực */}
      <Route element={<ProtectedRoute />}>
        {/* User routes */}
        <Route path='/users/*' element={<UserRoutes />} />

        {/* Category routes */}
        <Route path='/categories/*' element={<CategoryRoutes />} />

        {/* Brand routes */}
        <Route path='/brands/*' element={<BrandRoutes />} />

        {/* Profile page - Chỉ cần xác thực, không cần phân quyền */}
        <Route path='/profile' element={<ProfilePage />} />

        {/* Product routes */}
        <Route path='/products/*' element={<ProductRoutes />} />

        {/* Settings routes */}
        <Route path='/settings/*' element={<SettingRoutes />} />

        {/* Location routes */}
        <Route path='/locations/*' element={<LocationRoutes />} />

        {/* Shipping routes */}
        <Route path='/shipping-rates/*' element={<ShippingRoutes />} />

        {/* Order routes */}
        <Route path='/orders/*' element={<OrderRoutes />} />

        {/* Default route */}
        <Route path='/' element={<Navigate to='/users' replace />} />
      </Route>

      {/* Fallback route - chuyển hướng các routes không tồn tại */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

export default AppRoutes
