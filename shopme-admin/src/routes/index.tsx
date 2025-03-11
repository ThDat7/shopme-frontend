// src/App.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import { ProtectedRoute } from './ProtectedRoute'
import UserRoutes from './UserRoutes'
import Layout from '../components/layout/Layout'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route
        path='/users/*'
        element={
          <ProtectedRoute>
            <Layout>
              <UserRoutes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path='/users/*' element={<UserRoutes />} />
      <Route path='/' element={<Navigate to='/users' replace />} />
    </Routes>
  )
}

export default AppRoutes
