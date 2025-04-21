import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import {
  AuthenticationRequest,
  UserRole,
  RefreshTokenResponse,
} from '../types/authTypes'
import { message } from 'antd'
import {
  isTokenExpired,
  getUserInfoFromStorage,
  saveUserInfoToStorage,
  getTokenTimeRemaining,
} from '../utils/securityUtils'

// Define Timeout type without using NodeJS namespace
type TimeoutId = ReturnType<typeof setTimeout>

interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  userInfo: {
    id: number
    email: string
    firstName: string
    lastName: string
    roles: UserRole[]
    avatar: string
  } | null
  login: (credentials: AuthenticationRequest) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [tokenRefreshTimeout, setTokenRefreshTimeout] =
    useState<TimeoutId | null>(null)

  // Initial auth check
  useEffect(() => {
    checkAuthStatus()
    // Cleanup timeout on unmount
    return () => {
      if (tokenRefreshTimeout) {
        clearTimeout(tokenRefreshTimeout)
      }
    }
  }, [])

  // Set up token refresh mechanism
  useEffect(() => {
    if (isAuthenticated) {
      setupTokenRefresh()
    }
  }, [isAuthenticated])

  const setupTokenRefresh = () => {
    // Clear any existing timeout
    if (tokenRefreshTimeout) {
      clearTimeout(tokenRefreshTimeout)
    }

    const token = localStorage.getItem('token')
    if (!token) return

    // Calculate time to refresh (5 minutes before expiration)
    const tokenTimeRemaining = getTokenTimeRemaining(token)
    const refreshTime = Math.max(tokenTimeRemaining - 5 * 60 * 1000, 0)

    if (refreshTime <= 0) {
      // Token is already expired or very close to expiration
      refreshToken()
      return
    }

    // Set timeout to refresh token
    const timeout = setTimeout(async () => {
      const success = await refreshToken()
      if (success) {
        // If refresh was successful, set up next refresh
        setupTokenRefresh()
      }
    }, refreshTime)

    setTokenRefreshTimeout(timeout)
  }

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        setIsAuthenticated(false)
        setUserInfo(null)
        setLoading(false)
        return
      }

      if (isTokenExpired(token)) {
        // Try to refresh the token if it's expired
        const refreshed = await refreshToken()
        if (!refreshed) {
          // If refresh failed, logout
          logout()
        }
      } else {
        // Token is valid, get user info from storage
        const storedUserInfo = getUserInfoFromStorage()
        if (storedUserInfo) {
          setUserInfo(storedUserInfo)
          setIsAuthenticated(true)
        } else {
          logout()
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await authService.refreshToken()

      if (response && response.token) {
        localStorage.setItem('token', response.token)

        if (response.user) {
          saveUserInfoToStorage(response.user)
          setUserInfo(response.user)
        }

        setIsAuthenticated(true)
        return true
      }

      return false
    } catch (error) {
      console.error('Token refresh error:', error)
      logout()
      return false
    }
  }

  const login = async (credentials: AuthenticationRequest) => {
    try {
      setLoading(true)
      const response = await authService.login(credentials)

      if (response.token) {
        localStorage.setItem('token', response.token)

        // Save user info to storage
        if (response.user) {
          saveUserInfoToStorage(response.user)
          setUserInfo(response.user)
          setIsAuthenticated(true)
          message.success('Đăng nhập thành công')
          setupTokenRefresh()
        } else {
          throw new Error('User info missing from authentication response')
        }
      } else {
        message.error('Đăng nhập thất bại')
      }
    } catch (error) {
      console.error('Login error:', error)
      message.error(
        'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.'
      )
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // Clear token refresh timeout
    if (tokenRefreshTimeout) {
      clearTimeout(tokenRefreshTimeout)
      setTokenRefreshTimeout(null)
    }

    // Call logout API
    authService.logout()

    // Clear local state
    setIsAuthenticated(false)
    setUserInfo(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('lastActivity')

    message.success('Đăng xuất thành công')
  }

  const value = {
    isAuthenticated,
    loading,
    userInfo,
    login,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
