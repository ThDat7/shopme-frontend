// src/App.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import { ProtectedRoute } from './ProtectedRoute'
import UserRoutes from './UserRoutes'
import CategoryRoutes from './CategoryRoutes'
import ProfilePage from '../pages/profile/ProfilePage'

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
        path='/profile'
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path='/' element={<Navigate to='/users' replace />} />
    </Routes>
  )
}

export default AppRoutes
