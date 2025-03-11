import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { AuthenticationRequest } from '../types/authTypes'
import { message } from 'antd'

interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  userInfo: {
    email: string
    firstName: string
    lastName: string
    roles: string[]
  } | null
  login: (credentials: AuthenticationRequest) => Promise<void>
  logout: () => void
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
  const [userInfo, setUserInfo] = useState(authService.getUserInfo())

  useEffect(() => {
    checkAuthStatus()
    authService.setupAxiosInterceptors()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const authenticated = await authService.isAuthenticated()
      setIsAuthenticated(authenticated)
      if (authenticated) {
        setUserInfo(authService.getUserInfo())
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: AuthenticationRequest) => {
    try {
      const response = await authService.login(credentials)
      if (response.result.authenticated) {
        setIsAuthenticated(true)
        setUserInfo(response.result.userInfo)
        message.success('Login successful')
      } else {
        message.error('Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      message.error('Login failed. Please check your credentials.')
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUserInfo(null)
    message.success('Logged out successfully')
  }

  const value = {
    isAuthenticated,
    loading,
    userInfo,
    login,
    logout,
  }

  if (loading) {
    return <div>Loading...</div> // You can replace this with a proper loading component
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
