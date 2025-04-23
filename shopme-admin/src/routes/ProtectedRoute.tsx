import React, { useEffect } from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { message, Spin } from 'antd'

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, logout } = useAuth()
  const location = useLocation()

  // Track user activity and handle session timeout
  useEffect(() => {
    if (!isAuthenticated) return

    // Get the last activity timestamp from localStorage
    const lastActivity = localStorage.getItem('lastActivity')
    const currentTime = new Date().getTime()

    // Check if session has expired
    if (lastActivity) {
      const timeSinceLastActivity = currentTime - parseInt(lastActivity, 10)
      if (timeSinceLastActivity > SESSION_TIMEOUT) {
        message.error('Your session has expired. Please log in again.')
        logout()
        return
      }
    }

    // Update the last activity timestamp
    localStorage.setItem('lastActivity', currentTime.toString())

    // Setup event listeners to track user activity
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll']

    const updateActivity = () => {
      localStorage.setItem('lastActivity', new Date().getTime().toString())
    }

    // Add event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity)
    })

    // Clear event listeners on cleanup
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity)
      })
    }
  }, [isAuthenticated, logout])

  if (loading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Spin size='large' tip='Đang kiểm tra quyền truy cập...' />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  // Render child routes using Outlet
  return <Outlet />
}

export default ProtectedRoute
