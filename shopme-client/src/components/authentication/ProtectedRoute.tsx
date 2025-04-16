import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../../config/appConfig'
import { CustomerStatus } from '../../types/customer'
import { Spin } from 'antd'
import { useAuth } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, customer } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size='large' tip='Checking authentication...' />
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  // If email verification is required and not already on verification page, redirect
  if (
    customer?.status === CustomerStatus.UNVERIFIED &&
    location.pathname !== ROUTES.EMAIL_VERIFICATION
  ) {
    return <Navigate to={ROUTES.EMAIL_VERIFICATION} replace />
  }

  // If customer needs to provide additional information and not already on that page, redirect
  if (
    customer?.status === CustomerStatus.NEED_INFO &&
    location.pathname !== ROUTES.PROFILE
  ) {
    return <Navigate to={ROUTES.PROFILE} replace />
  }

  // If authenticated and all checks passed, render children
  return <>{children}</>
}

export default ProtectedRoute
