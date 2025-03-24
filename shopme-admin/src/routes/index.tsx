// src/App.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import { ProtectedRoute } from './ProtectedRoute'
import UserRoutes from './UserRoutes'
import CategoryRoutes from './CategoryRoutes'
import ProfilePage from '../pages/profile/ProfilePage'
import BrandRoutes from './BrandRoutes'
import ProductList from '../pages/products/ProductList'
import CreateProduct from '../pages/products/CreateProduct'
import EditProduct from '../pages/products/EditProduct'
import SettingRoutes from './SettingRoutes'
import LocationRoutes from './locationRoutes'
import OrderRoutes from './orderRoutes'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route
        path='/users/*'
        element={
          <ProtectedRoute>
            <UserRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path='/categories/*'
        element={
          <ProtectedRoute>
            <CategoryRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path='/brands/*'
        element={
          <ProtectedRoute>
            <BrandRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/products'
        element={
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        }
      />
      <Route
        path='/products/create'
        element={
          <ProtectedRoute>
            <CreateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path='/products/edit/:id'
        element={
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path='/settings/*'
        element={
          <ProtectedRoute>
            <SettingRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path='/locations/*'
        element={
          <ProtectedRoute>
            <LocationRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path='/orders/*'
        element={
          <ProtectedRoute>
            <OrderRoutes />
          </ProtectedRoute>
        }
      />
      <Route path='/' element={<Navigate to='/users' replace />} />
    </Routes>
  )
}

export default AppRoutes
