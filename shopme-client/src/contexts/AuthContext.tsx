import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { Customer } from '../types/customer'
import customerService from '../services/customerService'
import authService from '../services/authService'
import { CustomerLoginRequest } from '../types/auth'

interface AuthContextType {
  customer: Customer | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: CustomerLoginRequest) => Promise<Customer>
  loginWithGoogle: (credential: string) => Promise<Customer>
  logout: () => void
  updateCustomer: (customerData: Customer) => void
  refreshCustomerData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  customer: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ id: 0 } as Customer),
  loginWithGoogle: async () => ({ id: 0 } as Customer),
  logout: () => {},
  updateCustomer: () => {},
  refreshCustomerData: async () => {},
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)
      const token = localStorage.getItem('token')

      if (token) {
        try {
          const response = await customerService.getCurrentCustomer()
          if (response) {
            setCustomer(response)
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem('token')
            setIsAuthenticated(false)
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
          localStorage.removeItem('token')
          setIsAuthenticated(false)
        }
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (credentials: CustomerLoginRequest) => {
    setIsLoading(true)
    try {
      const customerResponse = await authService.login(credentials)

      if (customerResponse) {
        const { customer, token } = customerResponse

        localStorage.setItem('token', token)

        setCustomer(customer)
        setIsAuthenticated(true)

        return customer
      }
      throw new Error('Login failed')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (credential: string) => {
    setIsLoading(true)
    try {
      const customerResponse = await authService.loginWithGoogle({
        token: credential,
      })

      if (customerResponse) {
        const { customer, token } = customerResponse

        localStorage.setItem('token', token)

        setCustomer(customer)
        setIsAuthenticated(true)

        return customer
      }
      throw new Error('Google login failed')
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const refreshCustomerData = async () => {
    try {
      const customerData = await customerService.getCurrentCustomer()

      if (customerData) {
        setCustomer(customerData)
      }
    } catch (error) {
      console.error('Error refreshing customer data:', error)
      throw error
    }
  }

  const updateCustomer = (customerData: Customer) => {
    setCustomer(customerData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setCustomer(null)
    setIsAuthenticated(false)
  }

  const value = {
    customer,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    updateCustomer,
    refreshCustomerData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
